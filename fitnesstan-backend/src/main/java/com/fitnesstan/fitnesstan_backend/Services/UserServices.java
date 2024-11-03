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
        // Check if email already exists in database
        if (isEmailExists(user.getEmail()) || otpStore.containsKey(user.getEmail())) {
            throw new Exception("Username or email already exists.");
        }

        // Prepare user details with PENDING status and save to temporary store
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(Arrays.asList("USER"));
        user.setStatus("PENDING");
        user.setVerificationToken(generateOTP());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        // Store OTP in memory and send the verification email
        otpStore.put(user.getEmail(), user);
        sendVerificationEmail(user.getEmail(), user.getVerificationToken());
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

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    public Users validateUser(String email, String password) {
        Users user = userRepository.findByEmail(email);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }
}
