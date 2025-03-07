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
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        // Get age
        int age = calculateAge(additionalInfo.getDob());

        // Determine optimal BMI range based on age & gender
        double lowerBMI, upperBMI;
        if (additionalInfo.getGender().equalsIgnoreCase("male")) {
            if (age >= 18 && age <= 34) {
                lowerBMI = 23.0;
                upperBMI = 25.9;
            } else if (age >= 35 && age <= 44) {
                lowerBMI = 23.0;
                upperBMI = 26.9;
            } else if (age >= 45 && age <= 54) {
                lowerBMI = 24.0;
                upperBMI = 27.9;
            } else {
                lowerBMI = 18.5;
                upperBMI = 24.9; // Default
            }
        } else { // Female
            if (age >= 18 && age <= 34) {
                lowerBMI = 15.5;
                upperBMI = 24.9;
            } else if (age >= 35 && age <= 44) {
                lowerBMI = 19.0;
                upperBMI = 23.9;
            } else if (age >= 45 && age <= 54) {
                lowerBMI = 20.0;
                upperBMI = 25.9;
            } else {
                lowerBMI = 15.5;
                upperBMI = 22.9; // Default
            }
        }

        // Calculate REE (Mifflin-St Jeor Equation)
        double ree;
        if (additionalInfo.getGender().equalsIgnoreCase("male")) {
            ree = 10 * additionalInfo.getWeightKg() + 6.25 * (heightInMeters * 100)
                    - 5 * age + 5;
        } else {
            ree = 10 * additionalInfo.getWeightKg() + 6.25 * (heightInMeters * 100)
                    - 5 * age - 161;
        }

        // **Adjust REE based on age-specific BMI ranges**
        if (bmi < lowerBMI) {
            ree += 500; // Calorie surplus
        } else if (bmi >= upperBMI && bmi < 30) {
            ree -= 300; // Mild deficit
        } else if (bmi >= 30 && bmi < 40) {
            ree -= 600; // Moderate deficit
        } else if (bmi >= 40) {
            ree -= 1000; // Severe deficit
        }

        // **Calculate TDEE based on Exercise Level**
        double tdee;
        switch (additionalInfo.getExerciseLevel().toLowerCase()) {
            case "no exercise":
                tdee = ree;
                break;
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
        Diet demoDiet = addDemoMealsForUserAndReturn(savedUser.getId().toString());
        
        // Update user with both references.
        savedUser.setCurrentWorkoutPlan(workoutPlan);
        savedUser.setCurrentDiet(demoDiet);
        
        // Save the updated user with both references.
        userRepository.save(savedUser);
        
        // Debug output.
        System.out.println("[DEBUG] Updated User - WorkoutPlan: " + savedUser.getCurrentWorkoutPlan());
        System.out.println("[DEBUG] Updated User - Diet: " + savedUser.getCurrentDiet());
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
    @Transactional
    public Diet addDemoMealsForUserAndReturn(String userId) throws Exception {
        Optional<Users> optionalUser = userRepository.findById(new ObjectId(userId));
        if (!optionalUser.isPresent()) {
            throw new Exception("User not found with id: " + userId);
        }
        Users user = optionalUser.get();
    
        // Create a demo meal plan for 14 days using MealItem objects
        Map<Integer, Map<String, List<MealItem>>> mealPlan = new HashMap<>();
        for (int day = 1; day <= 14; day++) {
            Map<String, List<MealItem>> meals = new HashMap<>();
            // Demo meal: Breakfast (meal1)
            MealItem oatmeal = MealItem.builder()
                    .name("Oatmeal")
                    .protein(5.0)
                    .carbs(27.0)
                    .fats(3.0)
                    .calories(150.0)
                    .weight(40.0)
                    .build();
            MealItem fruitSalad = MealItem.builder()
                    .name("Fruit Salad")
                    .protein(1.0)
                    .carbs(15.0)
                    .fats(0.5)
                    .calories(70.0)
                    .weight(150.0)
                    .build();
            MealItem greenTea = MealItem.builder()
                    .name("Green Tea")
                    .protein(0.0)
                    .carbs(0.0)
                    .fats(0.0)
                    .calories(0.0)
                    .weight(250.0)
                    .build();
            List<MealItem> breakfastItems = Arrays.asList(oatmeal, fruitSalad, greenTea);
            meals.put("meal1", breakfastItems);
    
            // Demo meal: Lunch/Dinner (meal2)
            MealItem grilledChicken = MealItem.builder()
                    .name("Grilled Chicken")
                    .protein(30.0)
                    .carbs(0.0)
                    .fats(5.0)
                    .calories(200.0)
                    .weight(100.0)
                    .build();
            MealItem brownRice = MealItem.builder()
                    .name("Brown Rice")
                    .protein(3.0)
                    .carbs(45.0)
                    .fats(1.0)
                    .calories(210.0)
                    .weight(150.0)
                    .build();
            MealItem steamedVeggies = MealItem.builder()
                    .name("Steamed Vegetables")
                    .protein(2.0)
                    .carbs(10.0)
                    .fats(0.5)
                    .calories(50.0)
                    .weight(100.0)
                    .build();
            List<MealItem> lunchDinnerItems = Arrays.asList(grilledChicken, brownRice, steamedVeggies);
            meals.put("meal2", lunchDinnerItems);
    
            mealPlan.put(day, meals);
        }
    
        // Create a new Diet object with a 14-day plan
        Diet demoDiet = Diet.builder()
                .user(user)
                .mealPlan(mealPlan)
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusDays(14))
                .build();
    
        demoDiet = dietRepository.save(demoDiet);
        return demoDiet;
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
}
