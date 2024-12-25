package com.fitnesstan.fitnesstan_backend.Services;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.security.SecureRandom;

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
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.transaction.annotation.Transactional;

import com.fitnesstan.fitnesstan_backend.Entity.Users;
import com.fitnesstan.fitnesstan_backend.DAO.UserRepository;

@Service
public class UserServices {

    @Autowired
    private UserRepository userRepository;
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
        if (isEmailExists(user.getEmail()) ) {
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
        // Validate additional information
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
        if (additionalInfo.getOccupation() == null || additionalInfo.getOccupation().isEmpty()) {
            throw new Exception("Occupation is mandatory.");
        }
        if (additionalInfo.getReligion() == null || additionalInfo.getReligion().isEmpty()) {
            throw new Exception("Religion is mandatory.");
        }
        if (additionalInfo.getExerciseLevel() == null || additionalInfo.getExerciseLevel().isEmpty()) {
            throw new Exception("Exercise Level is mandatory.");
        }
        if (additionalInfo.getSleepHours() == null || additionalInfo.getSleepHours() < 0
                || additionalInfo.getSleepHours() > 24) {
            throw new Exception("Sleep Hours must be between 0 and 24.");
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
                "Thank you for signing up with Fitnesstan! To complete your registration, please verify your email address by using the OTP provided below:\n\n"
                +
                "-----------------------------\n" +
                "Your OTP: " + otp + "\n" +
                "-----------------------------\n\n" +
                "Please enter this OTP in the verification section of our application to activate your account.\n\n" +
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
        mse.printStackTrace(); // Log specific MailSendException details
        throw new Exception("Failed to send verification email due to a mail server issue.");
    } catch (Exception e) {
        e.printStackTrace(); // Log other exceptions
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

        otpStore.put(email, user); // Update otpStore with new OTP
        sendVerificationEmail(email, newOtp);
    }

    private String generateOTP() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000); // Generates a 6-digit OTP
        return String.valueOf(otp);
    }

    @Transactional
    public void verifyEmail(String email, String otp) throws Exception {
        // Retrieve user from otpStore
        Users user = otpStore.get(email);
        if (user == null || !user.getVerificationToken().equals(otp)) {
            throw new Exception("Invalid verification token."); // OTP not found or does not match
        }

        // Remove user from otpStore and set status to PASS
        otpStore.remove(email);

        user.setStatus("PASS");
        user.setVerificationToken(null);
        user.setUpdatedAt(LocalDateTime.now());

        // Persist verified user to the database
        userRepository.save(user);
    }

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

        // Store admin temporarily in otpStore and send OTP
        otpStore.put(admin.getEmail(), admin);
        sendVerificationEmail(admin.getEmail(), admin.getVerificationToken());
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
            userRepository.deleteById(new ObjectId(id)); // Delete or deactivate user
            return true;
        }
        return false;
    }
}
