package com.fitnesstan.fitnesstan_backend.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fitnesstan.fitnesstan_backend.DAO.FeedbackRepository;
import com.fitnesstan.fitnesstan_backend.DAO.UserRepository;
import com.fitnesstan.fitnesstan_backend.Entity.Feedback;
import com.fitnesstan.fitnesstan_backend.Entity.Users;
import com.fitnesstan.fitnesstan_backend.Services.UserServices;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/register")
public class PublicController {

    @Autowired
    private UserServices userServices;

    @Autowired
    private UserRepository userRepository;

    // ←— inject your new feedback repo
    @Autowired
    private FeedbackRepository feedbackRepository;

    // Health check endpoint
    @GetMapping("/health-check")
    public ResponseEntity<String> healthCheck() {
        return new ResponseEntity<>("OK", HttpStatus.OK);
    }

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Users user) {
        try {
            Users loggedInUser = userServices.validateUser(user.getEmail(), user.getPassword());
            if (loggedInUser != null) {
                if (!"PASS".equals(loggedInUser.getStatus())) {
                    return new ResponseEntity<>("Please verify your email to log in.", HttpStatus.FORBIDDEN);
                }

                // Wrap the user in a "user" key
                Map<String, Object> responseBody = new HashMap<>();
                responseBody.put("user", loggedInUser);

                return new ResponseEntity<>(responseBody, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Invalid email or password", HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Login failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Email verification endpoint
    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam("email") String email, @RequestParam("otp") String otp) {
        System.out.println("[DEBUG] Inside verifyEmail method"); // Debug line
        System.out.println("[DEBUG] Email: " + email + ", OTP: " + otp); // Debug line

        try {
            // Verify the email and update the user's status to PASS
            userServices.verifyEmail(email, otp);

            // Fetch the verified user from the database
            Users verifiedUser = userRepository.findByEmail(email);
            if (verifiedUser == null) {
                throw new Exception("User not found after verification.");
            }

            System.out.println("[DEBUG] User verified successfully: " + verifiedUser.getEmail()); // Debug line

            return new ResponseEntity<>(verifiedUser, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println("[DEBUG] Email verification failed: " + e.getMessage()); // Debug line
            return new ResponseEntity<>("Email verification failed: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // New endpoint for resending OTP
    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        try {
            userServices.resendOtp(email);
            return ResponseEntity.ok("OTP resent successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/required-info")
    public ResponseEntity<?> saveUserWithInfo(@RequestBody Map<String, Users> payload) {
        System.out.println("[DEBUG] Inside saveUserWithInfo method"); // Debug line
        System.out.println("[DEBUG] Payload received: " + payload); // Debug line

        try {
            Users user = payload.get("user"); // Basic user info
            Users additionalInfo = payload.get("additionalInfo"); // Additional information

            System.out.println("[DEBUG] User received: " + user); // Debug line
            System.out.println("[DEBUG] Additional info received: " + additionalInfo); // Debug line

            // Save the user to the database with a PENDING status
            userServices.saveUser(user, additionalInfo);

            System.out.println("[DEBUG] User saved successfully with PENDING status: " + user.getEmail()); // Debug line

            return new ResponseEntity<>("User saved successfully. Please verify your email.", HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println("[DEBUG] Failed to save user: " + e.getMessage()); // Debug line
            return new ResponseEntity<>("Failed to save user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/feedback")
    public ResponseEntity<?> submitFeedback(@RequestBody Feedback fb) {
        try {
            // stamp the time if the client hasn't
            if (fb.getSubmittedAt() == null) {
                fb.setSubmittedAt(java.time.LocalDateTime.now());
            }
            Feedback saved = feedbackRepository.save(fb);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(saved);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to save feedback: " + e.getMessage());
        }
    }

    @GetMapping("/feedbacks")
    public ResponseEntity<List<Map<String, String>>> getAllFeedbacks() {
        List<Map<String, String>> feedbacks = feedbackRepository.findAll().stream()
                .map(fb -> {
                    Map<String, String> feedbackMap = new HashMap<>();
                    feedbackMap.put("id", fb.getId().toString()); // Assuming id is a Long or Integer
                    feedbackMap.put("name", fb.getName());
                    feedbackMap.put("feedback", fb.getFeedback());
                    return feedbackMap;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(feedbacks);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity
                    .badRequest()
                    .body("Email is required");
        }
        try {
            // call into UserServices to generate & send an OTP
            userServices.sendPasswordResetOtp(email);
            return ResponseEntity.ok("OTP sent to your email");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not send OTP: " + e.getMessage());
        }
    }

    // NEW: actually reset the password
    // email is in the URL, otp + newPassword in the JSON body
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestParam("email") String email,
            @RequestBody Map<String, String> body) {

        String otp = body.get("otp");
        String newPassword = body.get("newPassword");

        if (otp == null || otp.isBlank()
                || newPassword == null || newPassword.length() < 6) {
            return ResponseEntity
                    .badRequest()
                    .body("OTP and newPassword(min 6 chars) are required");
        }

        try {
            // verify OTP and update the user’s password
            userServices.resetPasswordWithOtp(email, otp, newPassword);
            return ResponseEntity.ok("Password reset successfully");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Reset failed: " + e.getMessage());
        }
    }
}
