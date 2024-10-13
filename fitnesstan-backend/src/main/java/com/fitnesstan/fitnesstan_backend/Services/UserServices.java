package com.fitnesstan.fitnesstan_backend.Services;

import java.util.Arrays;
import java.util.List;
import java.time.LocalDateTime;
import java.security.SecureRandom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
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
    public void saveUser(Users user) throws Exception {
        // Check username and email uniqueness
        if (isEmailExists(user.getEmail())) {
            throw new Exception("Username or email already exists.");
        }

        // Prepare user details with PENDING status
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(Arrays.asList("USER"));
        user.setStatus("PENDING");
        user.setVerificationToken(generateOTP());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        // Send verification email with OTP
        try {
            // Store OTP in the in-memory store
            otpStore.put(user.getEmail(), user);
            
            System.err.println(otpStore);
            // Send the verification email
            sendVerificationEmail(user.getEmail(), user.getVerificationToken());
        } catch (Exception e) {
            throw new Exception("Failed to send verification email, rolling back.", e);
        }
    }

    private boolean isEmailExists(String email) {
        Query query = new Query(Criteria.where("email").is(email));
        return mongoTemplate.exists(query, Users.class);
    }

    private void sendVerificationEmail(String email, String otp) {
        String subject = "Verify your email";
        String message = "Your OTP for verification is: " + otp + "\nPlease enter this OTP to verify your email.";

        SimpleMailMessage emailMessage = new SimpleMailMessage();
        emailMessage.setTo(email);
        emailMessage.setSubject(subject);
        emailMessage.setText(message);

        mailSender.send(emailMessage);
    }

    // Method to generate a random OTP
    private String generateOTP() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000); // Generates a 6-digit OTP
        return String.valueOf(otp);
    }

    @Transactional
    public void verifyEmail(String email, String otp) throws Exception {
        System.out.println("Verification OTP is " + otp);
    
        // Check if the OTP matches the one stored in memory
        Users user = otpStore.get(email);
        System.out.println("Email = "+ otpStore.get(email) +"OTP = "+ otpStore.get(otp));
        if (user == null || !user.getVerificationToken().equals(otp)) {
            throw new Exception("Invalid verification token."); // OTP not found or does not match
        }
    
        // If OTP is valid, remove it from the store
        otpStore.remove(email);
    
        // Update user status to PASS and remove token
        user.setStatus("PASS");
        user.setVerificationToken(null);
        user.setUpdatedAt(LocalDateTime.now());
    
        // Save user only after status is PASS
        userRepository.save(user);
    }
    

    @Transactional
    public void createAdmin(Users admin) throws Exception {
        // Check if username or email already exists
        if ( isEmailExists(admin.getEmail())) {
            throw new Exception("Admin with the same username or email already exists.");
        }

        // Prepare admin details with PENDING status
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        admin.setRoles(Arrays.asList("ADMIN"));
        admin.setStatus("PENDING");
        admin.setVerificationToken(generateOTP());
        admin.setCreatedAt(LocalDateTime.now());
        admin.setUpdatedAt(LocalDateTime.now());

        try {
            sendVerificationEmail(admin.getEmail(), admin.getVerificationToken());
        } catch (Exception e) {
            throw new Exception("Failed to send verification email, rolling back.", e);
        }
    }

    public Users findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    public Users validateUser(String email, String password) {
        // Fetch the user by email from the repository
        Users user = userRepository.findByEmail(email); // Assuming you have this method in your UserRepository

        // Check if the user exists
        if (user != null) {
            // Use BCrypt to match the raw password with the encoded password
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user; // Return user if credentials are valid
            }
        }

        return null; // Return null if credentials are invalid
    }

}
