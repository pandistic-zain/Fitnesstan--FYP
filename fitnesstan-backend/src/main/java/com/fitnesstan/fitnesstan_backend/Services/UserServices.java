package com.fitnesstan.fitnesstan_backend.Services;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.Period;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.fitnesstan.fitnesstan_backend.Entity.Users;
import com.fitnesstan.fitnesstan_backend.Entity.WorkoutPlan;
import com.fitnesstan.fitnesstan_backend.Entity.Diet;
import com.fitnesstan.fitnesstan_backend.Entity.MealItem;
import com.fitnesstan.fitnesstan_backend.DAO.UserRepository;
import com.fitnesstan.fitnesstan_backend.DAO.DietRepository;

@Service
public class UserServices {

    @Autowired
    private UserRepository userRepository;

    // Injecting the DietRepository to manage Diet entities
    @Autowired
    private DietRepository dietRepository;

    // Injecting the WorkoutPlanServices to generate workout plans.
    @Autowired
    private WorkoutPlanServices workoutPlanServices;

    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private JavaMailSender mailSender;

    private static final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final ConcurrentHashMap<String, Users> otpStore = new ConcurrentHashMap<>();

    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void saveUserToDatabase(Users user) {
        userRepository.save(user);
    }

    // Encode password
    public String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    @Transactional
    public void saveUser(Users user, Users additionalInfo) throws Exception {
        // Validate email uniqueness
        if (isEmailExists(user.getEmail())) {
            throw new Exception("Email already exists.");
        }
        if (otpStore.containsKey(user.getEmail())) {
            // Clean up otpStore for the given email to avoid conflicts
            otpStore.remove(user.getEmail());
            System.out.println("OTPStore cleaned");
        }

        // Validate and set additional information
        validateAndSetAdditionalInfo(user, additionalInfo);

        // Prepare user details
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(Arrays.asList("USER"));
        user.setStatus("PENDING");
        user.setVerificationToken(generateOTP());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        // Store user in OTP store and send verification email
        if (otpStore.containsKey(user.getEmail())) {
            Users existingUser = otpStore.get(user.getEmail());
            if (existingUser.getCreatedAt().isBefore(LocalDateTime.now().minusMinutes(5))) {
                otpStore.remove(user.getEmail()); // Clear expired entry
            } else {
                throw new Exception("Email already exists.");
            }
        }
        otpStore.put(user.getEmail(), user);

        sendVerificationEmail(user.getEmail(), user.getVerificationToken());
    }

    @Transactional
    private void validateAndSetAdditionalInfo(Users user, Users additionalInfo) throws Exception {
        // Validate user input
        if (additionalInfo.getHeightFt() == null || additionalInfo.getHeightFt() <= 0) {
            throw new Exception("Height is mandatory and must be greater than 0.");
        }
        if (additionalInfo.getDob() == null) {
            throw new Exception("Date of Birth is mandatory.");
        }
        if (additionalInfo.getWeightKg() == null || additionalInfo.getWeightKg() <= 0) {
            throw new Exception("Weight is mandatory and must be greater than 0.");
        }
        if (additionalInfo.getGender() == null || additionalInfo.getGender().isEmpty()) {
            throw new Exception("Gender is mandatory.");
        }

        // Convert height from feet to meters
        double heightInMeters = additionalInfo.getHeightFt() * 0.3048;

        // Calculate BMI
        double bmi = additionalInfo.getWeightKg() / (heightInMeters * heightInMeters);

        // Get age (assumes calculateAge returns age as an int)
        int age = calculateAge(additionalInfo.getDob());

        // Determine optimal BMI range based on age & gender
        double lowerBMI, upperBMI;
        if (additionalInfo.getGender().equalsIgnoreCase("male")) {
            if (age >= 18 && age <= 34) {
                lowerBMI = 18.7;
                upperBMI = 25.9;
            } else if (age >= 35 && age <= 44) {
                lowerBMI = 23.0;
                upperBMI = 26.9;
            } else if (age >= 45 && age <= 54) {
                lowerBMI = 24.0;
                upperBMI = 27.9;
            } else {
                lowerBMI = 18.5;
                upperBMI = 24.9; // Default values
            }
        } else { // For female
            if (age >= 18 && age <= 34) {
                lowerBMI = 15.5;
                upperBMI = 21.9;
            } else if (age >= 35 && age <= 44) {
                lowerBMI = 19.0;
                upperBMI = 23.9;
            } else if (age >= 45 && age <= 54) {
                lowerBMI = 20.0;
                upperBMI = 25.9;
            } else {
                lowerBMI = 15.5;
                upperBMI = 22.9; // Default values
            }
        }

        // Calculate REE using the Mifflin-St Jeor Equation
        double ree;
        if (additionalInfo.getGender().equalsIgnoreCase("male")) {
            ree = 10 * additionalInfo.getWeightKg() + 6.25 * (heightInMeters * 100)
                    - 5 * age + 5;
        } else {
            ree = 10 * additionalInfo.getWeightKg() + 6.25 * (heightInMeters * 100)
                    - 5 * age - 161;
        }

        // Adjust REE based on where BMI lies relative to the normal range.
        double midBMI = (lowerBMI + upperBMI) / 2;
        if (bmi < lowerBMI) {
            // BMI is below the normal range → add surplus 500 cal.
            ree += 500;
        } else if (bmi >= lowerBMI && bmi < midBMI) {
            // BMI is in the lower half of the normal range → add surplus 300 cal.
            ree += 300;
        } else if (bmi >= midBMI && bmi <= upperBMI) {
            // BMI is in the upper half of the normal range → subtract deficit 200 cal.
            ree -= 200;
        } else if (bmi > upperBMI) {
            // BMI is above normal range (overweight/obese) → subtract deficit 500 cal.
            ree -= 500;
        }

        // Calculate TDEE based on the user's exercise level
        double tdee;
        switch (additionalInfo.getExerciseLevel().toLowerCase()) {
            case "no exercise":
            case "1 days a week":
                tdee = ree * 1.1;
                break;
            case "2 days a week":
                tdee = ree * 1.2;
                break;
            case "3 days a week":
                tdee = ree * 1.375;
                break;
            case "4 days a week":
                tdee = ree * 1.46;
                break;
            case "5 days a week":
                tdee = ree * 1.55;
                break;
            case "6 days a week":
                tdee = ree * 1.725;
                break;
            case "7 days a week":
                tdee = ree * 1.9;
                break;
            default:
                throw new Exception("Invalid Exercise Level.");
        }

        // Set additional information to the user object
        user.setHeightFt(additionalInfo.getHeightFt());
        user.setDob(additionalInfo.getDob());
        user.setWeightKg(additionalInfo.getWeightKg());
        user.setGender(additionalInfo.getGender());
        user.setOccupation(additionalInfo.getOccupation());
        user.setReligion(additionalInfo.getReligion());
        user.setExerciseLevel(additionalInfo.getExerciseLevel());
        user.setSleepHours(additionalInfo.getSleepHours());
        user.setMedicalHistory(additionalInfo.getMedicalHistory());

        // Set calculated values
        user.setBmi(bmi);
        user.setRee(ree);
        user.setTdee(tdee);
    }

    // Helper method to calculate age from date of birth
    private int calculateAge(LocalDate dob) {
        return Period.between(dob, LocalDate.now()).getYears();
    }

    private boolean isEmailExists(String email) {
        System.out.println("Checking if email exists: " + email);
        Query query = new Query(Criteria.where("email").is(email));
        boolean exists = mongoTemplate.exists(query, Users.class);
        System.out.println("Email exists: " + exists);
        return exists;
    }

    private void sendVerificationEmail(String email, String otp) throws Exception {
        try {
            String subject = "Account Verification - Fitnesstan";

            String message = "Dear User,\n\n" +
                    "Thank you for signing up with Fitnesstan! To complete your registration, please  your email address by using the OTP provided below:\n\n"
                    +
                    "-----------------------------\n" +
                    "Your OTP: " + otp + "\n" +
                    "-----------------------------\n\n" +
                    "Please enter this OTP in the verification section of our application to activate your account.\n\n"
                    +
                    "If you did not sign up for Fitnesstan, please ignore this email or contact our support team for assistance.\n\n"
                    +
                    "Best Regards,\n" +
                    "The Fitnesstan Team\n\n" +
                    "Fitnesstan | Empowering Your Fitness Journey\n" +
                    "Email: zain.alphanetworks@gmail.com | Phone: +92 3446558870\n" +
                    "Website: ------------------------------";

            SimpleMailMessage emailMessage = new SimpleMailMessage();
            emailMessage.setTo(email);
            emailMessage.setSubject(subject);
            emailMessage.setText(message);

            mailSender.send(emailMessage);
            System.out.println("Verification email sent successfully to: " + email);
        } catch (MailSendException mse) {
            mse.printStackTrace();
            throw new Exception("Failed to send verification email due to a mail server issue.");
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception("Unexpected error while sending email: " + e.getMessage());
        }
    }

    public void resendOtp(String email) throws Exception {
        // Retrieve user from otpStore
        Users user = otpStore.get(email);
        if (user == null) {
            throw new Exception("User not found or already verified.");
        }

        // Generate a new OTP and update the otpStore
        String newOtp = generateOTP();
        user.setVerificationToken(newOtp);
        user.setUpdatedAt(LocalDateTime.now());

        otpStore.put(email, user);
        sendVerificationEmail(email, newOtp);
    }

    private String generateOTP() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000); // Generates a 6-digit OTP
        return String.valueOf(otp);
    }

    @Transactional
    public void verifyEmail(String email, String otp) throws Exception {
        // Retrieve user from otpStore and verify OTP.
        Users user = otpStore.get(email);
        if (user == null || !user.getVerificationToken().equals(otp)) {
            System.out.println("[DEBUG] Email verification failed: Invalid verification token.");
            throw new Exception("Invalid verification token.");
        }

        // Remove the user from OTP store.
        otpStore.remove(email);

        // Update user status and clear the verification token.
        user.setStatus("PASS");
        user.setVerificationToken(null);
        user.setUpdatedAt(LocalDateTime.now());

        // Save user to generate a valid ID.
        Users savedUser = userRepository.save(user);

        // Generate workout plan and diet plan using the saved user's ID.
        WorkoutPlan workoutPlan = workoutPlanServices.generateWorkoutPlan(savedUser.getId().toString());
        Map<String, Object> flaskResponse = sendUserDataToFlask(savedUser);
        Diet diet = addDietPlanFromFlaskResponse(savedUser.getId().toString(), flaskResponse);

        // Update user with both references.
        savedUser.setCurrentWorkoutPlan(workoutPlan);
        savedUser.setCurrentDiet(diet);

        // Save the updated user with both references.
        userRepository.save(savedUser);

        // If no exceptions thrown, user is successfully verified.
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> sendUserDataToFlask(Users user) {
        System.out.println("[DEBUG] Inside sendUserDataToFlask method"); // Debug line

        try {
            String flaskUrl = "http://localhost:5000/user";
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Create a request payload with user data
            Map<String, Object> userData = new HashMap<>();
            userData.put("heightFt", user.getHeightFt());
            userData.put("weightKg", user.getWeightKg());
            userData.put("bmi", user.getBmi());
            userData.put("ree", user.getRee());
            userData.put("tdee", user.getTdee());
            userData.put("exerciseLevel", user.getExerciseLevel());
            userData.put("sleepHours", user.getSleepHours());
            userData.put("medicalHistory", user.getMedicalHistory());
            userData.put("gender", user.getGender());
            userData.put("dob", user.getDob());

            System.out.println("[DEBUG] User data prepared for Flask: " + userData); // Debug line

            // Send the request to the Flask server
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(userData, headers);
            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.postForEntity(flaskUrl, request, Map.class);

            System.out.println("[DEBUG] Response received from Flask: " + response.getBody()); // Debug line

            if (response.getStatusCode() == HttpStatus.OK) {
                // Return the response body (model's output)
                return response.getBody();
            } else {
                System.out.println("[DEBUG] Failed to get model response: " + response.getBody()); // Debug line
                return Map.of("error", "Failed to get model response");
            }
        } catch (Exception e) {
            System.out.println("[DEBUG] Error sending user data to Flask: " + e.getMessage()); // Debug line
            return Map.of("error", "Error sending user data to Flask: " + e.getMessage());
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    @Transactional
    public void createAdmin(Users admin) throws Exception {
        // Check if email already exists in database
        if (isEmailExists(admin.getEmail())) {
            throw new Exception("Admin with the same username or email already exists.");
        }

        // Prepare admin details and save
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        admin.setRoles(Arrays.asList("ADMIN"));
        admin.setStatus("PENDING");
        admin.setVerificationToken(generateOTP());
        admin.setCreatedAt(LocalDateTime.now());
        admin.setUpdatedAt(LocalDateTime.now());

        otpStore.put(admin.getEmail(), admin);
        sendVerificationEmail(admin.getEmail(), admin.getVerificationToken());
    }

    // ============================================
    // NEW METHOD: Add demo meals for a specific user
    // ============================================
    @SuppressWarnings("unchecked")
    @Transactional
    public Diet addDietPlanFromFlaskResponse(String userId, Map<String, Object> flaskResponse) throws Exception {
        // Retrieve the user by their ID
        Optional<Users> optionalUser = userRepository.findById(new ObjectId(userId));
        if (!optionalUser.isPresent()) {
            throw new Exception("User not found with id: " + userId);
        }
        Users user = optionalUser.get();

        // Extract the mealPlan, startDate, and endDate from the Flask response.
        Object mealPlanObj = flaskResponse.get("mealPlan");
        if (mealPlanObj == null) {
            throw new Exception("MealPlan is missing in the Flask response.");
        }

        // Convert the mealPlan into the expected structure
        Map<String, Object> flaskMealPlan = (Map<String, Object>) mealPlanObj;
        Map<Integer, Map<String, List<MealItem>>> mealPlan = new HashMap<>();

        for (Map.Entry<String, Object> dayEntry : flaskMealPlan.entrySet()) {
            // Convert day number key from String to Integer
            Integer dayNumber = Integer.parseInt(dayEntry.getKey());

            // Each day's value is a Map: { "meal1": [...], "meal2": [...] }
            Map<String, Object> mealMap = (Map<String, Object>) dayEntry.getValue();
            Map<String, List<MealItem>> dayMeals = new HashMap<>();

            for (Map.Entry<String, Object> mealEntry : mealMap.entrySet()) {
                String mealName = mealEntry.getKey();
                List<Object> itemsList = (List<Object>) mealEntry.getValue();
                List<MealItem> mealItems = new java.util.ArrayList<>();

                for (Object itemObj : itemsList) {
                    Map<String, Object> itemMap = (Map<String, Object>) itemObj;
                    MealItem mealItem = MealItem.builder()
                            .name((String) itemMap.get("name"))
                            .protein(Double.parseDouble(itemMap.get("protein").toString()))
                            .carbs(Double.parseDouble(itemMap.get("carbs").toString()))
                            .fats(Double.parseDouble(itemMap.get("fats").toString()))
                            .calories(Double.parseDouble(itemMap.get("calories").toString()))
                            .weight(Double.parseDouble(itemMap.get("weight").toString()))
                            .build();
                    mealItems.add(mealItem);
                }
                dayMeals.put(mealName, mealItems);
            }
            mealPlan.put(dayNumber, dayMeals);
        }

        // Parse startDate and endDate from the Flask response.
        String startDateStr = (String) flaskResponse.get("startDate");
        String endDateStr = (String) flaskResponse.get("endDate");
        LocalDate startDate = LocalDate.parse(startDateStr);
        LocalDate endDate = LocalDate.parse(endDateStr);

        // Create and save the Diet object
        Diet diet = Diet.builder()
                .user(user)
                .mealPlan(mealPlan)
                .startDate(startDate)
                .endDate(endDate)
                .build();
        diet = dietRepository.save(diet);

        return diet;
    }

    public Users findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Users validateUser(String email, String password) {
        Users user = userRepository.findByEmail(email);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }

    public boolean updateUser(String id, Users user) {
        Optional<Users> existingUser = userRepository.findById(new ObjectId(id));
        if (existingUser.isPresent()) {
            Users userToUpdate = existingUser.get();
            userToUpdate.setUsername(user.getUsername());
            userToUpdate.setEmail(user.getEmail());
            userToUpdate.setRoles(user.getRoles());
            userToUpdate.setStatus(user.getStatus());
            userToUpdate.setUpdatedAt(LocalDateTime.now());
            userRepository.save(userToUpdate);
            return true;
        }
        return false;
    }

    public boolean deleteUser(String id) {
        if (userRepository.existsById(new ObjectId(id))) {
            userRepository.deleteById(new ObjectId(id));
            return true;
        }
        return false;
    }

    /**
     * Fetches the current workout and diet plans for a user on login.
     * Returns a map with keys "diet" and "workoutPlan".
     */
    public Map<String, Object> getUserPlans(String email) throws Exception {
        Users user = userRepository.findByEmail(email);
        if (user == null) {
            throw new Exception("User not found.");
        }
        Map<String, Object> plans = new HashMap<>();
        plans.put("diet", user.getCurrentDiet());
        // Assuming that workout plan is fetched by user in WorkoutPlanRepository
        // Alternatively, if you have stored currentWorkoutPlan in user, use that.
        // For this example, we simply return a placeholder or null.
        // plans.put("workoutPlan", user.getCurrentWorkoutPlan());
        return plans;
    }

    @Transactional
    public void changePassword(String email, String currentPassword, String newPassword) throws Exception {
        // Retrieve the user by email (or username as stored in your system)
        Users user = userRepository.findByUsername(email);
        if (user == null) {
            throw new Exception("User not found.");
        }

        // Verify that the provided current password matches the stored (encoded)
        // password.
        // Note: passwordEncoder here is the BCryptPasswordEncoder instance.
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new Exception("Current password is incorrect.");
        }

        // Encode the new password and update the user record.
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

}
