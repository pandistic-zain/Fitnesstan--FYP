package com.fitnesstan.fitnesstan_backend.Services;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.Period;
import java.security.SecureRandom;
import java.util.ArrayList;
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
import com.fitnesstan.fitnesstan_backend.DAO.WorkoutPlanRepository;
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
    private WorkoutPlanRepository workoutPlanRepository;

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

    @Transactional
    public void validateAndResubmitUserInfo(Users updatedInfo) throws Exception {
        // Step 1: Fetch the authenticated user using the email from Spring Security
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
        Users user = userRepository.findByEmail(email);

        if (user == null) {
            throw new Exception("User not found.");
        }

        // Step 2: Validate the updated form data
        if (updatedInfo.getHeightFt() == null || updatedInfo.getHeightFt() <= 0) {
            throw new Exception("Height is mandatory and must be greater than 0.");
        }
        if (updatedInfo.getDob() == null) {
            throw new Exception("Date of Birth is mandatory.");
        }
        if (updatedInfo.getWeightKg() == null || updatedInfo.getWeightKg() <= 0) {
            throw new Exception("Weight is mandatory and must be greater than 0.");
        }
        if (updatedInfo.getGender() == null || updatedInfo.getGender().isEmpty()) {
            throw new Exception("Gender is mandatory.");
        }

        // Step 3: Convert height from feet to meters
        double heightInMeters = updatedInfo.getHeightFt() * 0.3048;

        // Step 4: Calculate BMI
        double bmi = updatedInfo.getWeightKg() / (heightInMeters * heightInMeters);

        // Step 5: Get age (assumes calculateAge returns age as an int)
        int age = calculateAge(updatedInfo.getDob());

        // Step 6: Determine optimal BMI range based on age & gender
        double lowerBMI, upperBMI;
        if (updatedInfo.getGender().equalsIgnoreCase("male")) {
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

        // Step 7: Calculate REE using the Mifflin-St Jeor Equation
        double ree;
        if (updatedInfo.getGender().equalsIgnoreCase("male")) {
            ree = 10 * updatedInfo.getWeightKg() + 6.25 * (heightInMeters * 100)
                    - 5 * age + 5;
        } else {
            ree = 10 * updatedInfo.getWeightKg() + 6.25 * (heightInMeters * 100)
                    - 5 * age - 161;
        }

        // Step 8: Adjust REE based on where BMI lies relative to the normal range
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

        // Step 9: Calculate TDEE based on the user's exercise level
        double tdee;
        switch (updatedInfo.getExerciseLevel().toLowerCase()) {
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

        // Step 10: Update the user object with the validated and calculated values
        user.setHeightFt(updatedInfo.getHeightFt());
        user.setDob(updatedInfo.getDob());
        user.setWeightKg(updatedInfo.getWeightKg());
        user.setGender(updatedInfo.getGender());
        user.setOccupation(updatedInfo.getOccupation());
        user.setReligion(updatedInfo.getReligion());
        user.setExerciseLevel(updatedInfo.getExerciseLevel());
        user.setSleepHours(updatedInfo.getSleepHours());
        user.setMedicalHistory(updatedInfo.getMedicalHistory());

        // Step 11: Set calculated values
        user.setBmi(bmi);
        user.setRee(ree);
        user.setTdee(tdee);

        // Step 12: Call the function after setting the new values
        userRepository.save(user);
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
    public Map<String, Object> sendUserDataToFlask(Users user) {
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
            ResponseEntity<Map> response = restTemplate.postForEntity(flaskUrl, request, Map.class);

            // System.out.println("[DEBUG] Response received from Flask: " +
            // response.getBody());

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
    @Transactional
    public void deleteUserDietAndRemoveReference(String userId) throws Exception {
        // Step 1: Fetch the user from the user repository by the user ID
        Users user = userRepository.findById(new ObjectId(userId))
                .orElseThrow(() -> new Exception("User not found with id: " + userId));
        
        // Step 2: Check if the user has an associated current diet
        Diet currentDiet = user.getCurrentDiet();
        if (currentDiet == null) {
            throw new Exception("User does not have a current diet.");
        }
    
        // Step 3: Delete the diet from the diet repository
        dietRepository.delete(currentDiet);  // Delete diet record from Diet repository
    
        // Step 4: Remove the reference from the user's diet
        user.setCurrentDiet(null);  // Nullify the diet reference in the user entity
    
        // Step 5: Save the updated user entity to the user repository
        userRepository.save(user);  // Save the user with the updated (null) diet reference
    
        System.out.println("[DEBUG] Current diet deleted and reference removed for user: " + userId);
    }
    @Transactional
    public void deleteUserWorkoutPlanAndRemoveReference(String userId) throws Exception {
        // Step 1: Fetch the user from the user repository by the user ID
        Users user = userRepository.findById(new ObjectId(userId))
                .orElseThrow(() -> new Exception("User not found with id: " + userId));
        
        // Step 2: Check if the user has an associated current workout plan
        WorkoutPlan currentWorkoutPlan = user.getCurrentWorkoutPlan();
        if (currentWorkoutPlan == null) {
            throw new Exception("User does not have a current workout plan.");
        }
    
        // Step 3: Delete the workout plan from the workout plan repository
        workoutPlanRepository.delete(currentWorkoutPlan);  // Delete workout plan record from WorkoutPlan repository
    
        // Step 4: Remove the reference from the user's workout plan
        user.setCurrentWorkoutPlan(null);  // Nullify the workout plan reference in the user entity
    
        // Step 5: Save the updated user entity to the user repository
        userRepository.save(user);  // Save the user with the updated (null) workout plan reference
    
        System.out.println("[DEBUG] Current workout plan deleted and reference removed for user: " + userId);
    }
        
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    // ============================================
    // NEW METHOD: Add demo meals for a specific user
    // ============================================
    @SuppressWarnings("unchecked")
    @Transactional
    public Diet addDietPlanFromFlaskResponse(String userId, Map<String, Object> flaskResponse) throws Exception {
        // 1) Load user
        Users user = userRepository.findById(new ObjectId(userId))
                .orElseThrow(() -> new Exception("User not found with id: " + userId));

        // 2) Extract mealPlan
        Map<String, Object> flaskMealPlan = (Map<String, Object>) flaskResponse.get("mealPlan");
        if (flaskMealPlan == null) {
            throw new Exception("MealPlan is missing in the Flask response.");
        }
        // List<MealItem>>>
        Map<Integer, Map<String, List<MealItem>>> mealPlan = new HashMap<>();

        for (var dayEntry : flaskMealPlan.entrySet()) {
            Integer day = Integer.valueOf(dayEntry.getKey());
            Map<String, Object> mealsMap = (Map<String, Object>) dayEntry.getValue();

            Map<String, List<MealItem>> mealsForDay = new HashMap<>();
            for (var mealEntry : mealsMap.entrySet()) {
                String mealName = mealEntry.getKey(); // "breakfast" or "dinner"
                List<Map<String, Object>> items = (List<Map<String, Object>>) mealEntry.getValue();

                List<MealItem> list = new ArrayList<>(items.size());
                for (var item : items) {
                    // parse out only the mandatory fields + required_calories, and the item name
                    String itemName = item.get("name").toString(); // Extract item name
                    double protein = Double.parseDouble(item.get("protein").toString());
                    double carbs = Double.parseDouble(item.get("carbohydrate").toString());
                    double fats = Double.parseDouble(item.get("total_fat").toString());
                    double weight = Double.parseDouble(item.get("serving_weight").toString());
                    double calories = Double.parseDouble(item.get("required_calories").toString());

                    // Build MealItem with item name and other details
                    MealItem m = MealItem.builder()
                            .name(itemName) // Add the item name here
                            .protein(protein)
                            .carbs(carbs)
                            .fats(fats)
                            .weight(weight)
                            .calories(calories)
                            .build();
                    list.add(m);
                }

                mealsForDay.put(mealName, list);
            }
            mealPlan.put(day, mealsForDay);
        }

        // 4) Parse dates
        String start = (String) flaskResponse.get("startDate");
        String end = (String) flaskResponse.get("endDate");
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);

        // 5) Persist
        Diet diet = Diet.builder()
                .user(user)
                .mealPlan(mealPlan)
                .startDate(startDate)
                .endDate(endDate)
                .build();
        return dietRepository.save(diet);
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

    @SuppressWarnings({ "unchecked", "null" })
    @Transactional
    public boolean changeItemFromCluster(String userIdStr, String itemName, double tdee) {
        // 1) Prepare the JSON you’ll send to Flask, including tdee
        Map<String, Object> toFlask = new HashMap<>();
        toFlask.put("item_name", itemName);
        toFlask.put("tdee", tdee); // Add tdee to the request

        System.out.println("[DEBUG] Sending to Flask with tdee: " + toFlask);

        RestTemplate rt = new RestTemplate();
        ResponseEntity<Map> flaskResp = rt.postForEntity(
                "http://localhost:5000/change_item",
                new HttpEntity<>(toFlask, createJsonHeaders()),
                Map.class);

        // Debugging the response from Flask
        System.out.println("[DEBUG] Flask response: " + flaskResp);

        if (!flaskResp.getStatusCode().is2xxSuccessful() || flaskResp.getBody() == null) {
            System.out.println("[ERROR] Flask response failed or no body returned");
            return false;
        }

        // 2) Extract the scaled-item fields from Flask response
        Map<String, Object> scaled = flaskResp.getBody();
        if (!scaled.containsKey("name")) {
            System.out.println("[ERROR] Flask response does not contain item 'name'");
            return false;
        }

        String newName = (String) scaled.get("name");
        double protein = ((Number) scaled.get("protein")).doubleValue();
        double carbs = ((Number) scaled.get("carbohydrate")).doubleValue();
        double fats = ((Number) scaled.get("total_fat")).doubleValue();
        double weight = ((Number) scaled.get("serving_weight")).doubleValue();
        double cal = ((Number) scaled.get("required_calories")).doubleValue();

        // Debugging extracted data
        System.out.println("[DEBUG] Scaled item - Name: " + newName + ", Protein: " + protein + ", Carbs: " + carbs +
                ", Fats: " + fats + ", Weight: " + weight + ", Calories: " + cal);

        // 3) Load the user & its diet
        Users user = userRepository.findById(new ObjectId(userIdStr))
                .orElseThrow(() -> new RuntimeException("User not found: " + userIdStr));

        Map<Integer, Map<String, List<MealItem>>> mealPlan = user.getCurrentDiet().getMealPlan();
        if (mealPlan == null) {
            System.out.println("[ERROR] Meal plan is null");
            return false;
        }

        // 4) Find and replace the old item
        boolean replaced = false;
        for (var dayEntry : mealPlan.entrySet()) {
            for (var meals : dayEntry.getValue().entrySet()) {
                List<MealItem> items = meals.getValue();
                for (int i = 0; i < items.size(); i++) {
                    if (items.get(i).getName().equals(itemName)) {
                        // Debugging before removing item
                        System.out.println("[DEBUG] Found item to replace: " + items.get(i).getName());

                        // Remove the old item
                        items.remove(i);

                        // Create new item with updated nutritional values
                        MealItem m = MealItem.builder()
                                .name(newName)
                                .protein(protein)
                                .carbs(carbs)
                                .fats(fats)
                                .weight(weight)
                                .calories(cal)
                                .build();

                        // Add the new item to the list
                        items.add(m);

                        // Set replaced flag to true
                        replaced = true;

                        // Debugging the replacement
                        System.out.println("[DEBUG] Replaced \"" + itemName + "\" with \"" + newName + "\"");
                        break;
                    }
                }
                if (replaced)
                    break;
            }
            if (replaced)
                break;
        }

        // 5) Save the updated user and meal plan
        if (replaced) {
            // Save updated diet plan
            Diet updatedDiet = user.getCurrentDiet();
            updatedDiet.setMealPlan(mealPlan); // Save the modified meal plan

            // Persist updated diet
            dietRepository.save(updatedDiet);

            // Save the updated user with the modified diet plan
            userRepository.save(user);

            System.out.println("[DEBUG] Meal plan updated and saved in MongoDB");
            return true;
        } else {
            System.out.println("[DEBUG] No matching item \"" + itemName + "\" found to replace");
            return false;
        }
    }

    private HttpHeaders createJsonHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

}
