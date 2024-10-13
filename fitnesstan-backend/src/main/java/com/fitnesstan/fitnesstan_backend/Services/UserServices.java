package com.fitnesstan.fitnesstan_backend.Services;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
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

    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void saveUser(Users user) throws Exception {
        // Check username and email uniqueness
        if (isUsernameExists(user.getUsername()) || isEmailExists(user.getEmail())) {
            throw new Exception("Username or email already exists.");
        }

        // Prepare user details with PENDING status
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(Arrays.asList("USER"));
        user.setStatus("PENDING");
        user.setVerificationToken(generateVerificationToken());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        // Store the user temporarily in case of rollback
        try {
            sendVerificationEmail(user.getEmail(), user.getVerificationToken());
        } catch (Exception e) {
            throw new Exception("Failed to send verification email, rolling back.");
        }

        // Save logic moved to `verifyEmail` to ensure only verified users are stored.
    }

    private boolean isUsernameExists(String username) {
        Query query = new Query(Criteria.where("username").is(username));
        return mongoTemplate.exists(query, Users.class);
    }

    private boolean isEmailExists(String email) {
        Query query = new Query(Criteria.where("email").is(email));
        return mongoTemplate.exists(query, Users.class);
    }

    private String generateVerificationToken() {
        return UUID.randomUUID().toString();
    }

    private void sendVerificationEmail(String email, String token) {
        String subject = "Verify your email";
        String verificationUrl = "http://localhost:8080/verify-email?token=" + token;

        String message = "Click the link below to verify your email:\n" + verificationUrl;

        SimpleMailMessage emailMessage = new SimpleMailMessage();
        emailMessage.setTo(email);
        emailMessage.setSubject(subject);
        emailMessage.setText(message);

        mailSender.send(emailMessage);
    }

    @Transactional
    public void verifyEmail(String token) throws Exception {
        Query query = new Query(Criteria.where("verificationToken").is(token));
        Users user = mongoTemplate.findOne(query, Users.class);

        if (user == null) {
            throw new Exception("Invalid verification token.");
        }

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
        if (isUsernameExists(admin.getUsername()) || isEmailExists(admin.getEmail())) {
            throw new Exception("Admin with the same username or email already exists.");
        }

        // Prepare admin details with PENDING status
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        admin.setRoles(Arrays.asList("ADMIN"));
        admin.setStatus("PENDING");
        admin.setVerificationToken(generateVerificationToken());
        admin.setCreatedAt(LocalDateTime.now());
        admin.setUpdatedAt(LocalDateTime.now());

        try {
            sendVerificationEmail(admin.getEmail(), admin.getVerificationToken());
        } catch (Exception e) {
            throw new Exception("Failed to send verification email, rolling back.");
        }

        // Save logic moved to `verifyEmail` for the same reason as users.
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
