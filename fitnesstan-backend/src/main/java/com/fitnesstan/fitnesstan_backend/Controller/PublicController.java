package com.fitnesstan.fitnesstan_backend.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import com.fitnesstan.fitnesstan_backend.Entity.Users;
import com.fitnesstan.fitnesstan_backend.Services.UserServices;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/register")
public class PublicController {

    @Autowired
    private UserServices userServices;

    // Health check endpoint
    @GetMapping("/health-check")
    public ResponseEntity<String> healthCheck() {
        return new ResponseEntity<>("OK", HttpStatus.OK);
    }

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Users user) {
        System.out.println("[DEBUG] Inside loginUser method"); // Debug line

        try {
            Users loggedInUser = userServices.validateUser(user.getEmail(), user.getPassword());

            if (loggedInUser != null) {
                if (!"PASS".equals(loggedInUser.getStatus())) {
                    return new ResponseEntity<>("Please verify your email to log in.", HttpStatus.FORBIDDEN);
                }
            
                // Send user data to Flask server and get the response
                Map<String, Object> modelResponse = sendUserDataToFlask(loggedInUser);
            
                // Combine the user data and model response
                Map<String, Object> response = new HashMap<>();
                response.put("user", loggedInUser);
                response.put("modelResponse", modelResponse);
            
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                System.out.println("[DEBUG] Invalid email or password"); // Debug line
                return new ResponseEntity<>("Invalid email or password", HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            System.out.println("[DEBUG] Login failed: " + e.getMessage()); // Debug line
            return new ResponseEntity<>("Login failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
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

    // Email verification endpoint
    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam("email") String email, @RequestParam("otp") String otp) {
        try {
            userServices.verifyEmail(email, otp);
            return new ResponseEntity<>("Email verified successfully. You can now log in.", HttpStatus.OK);
        } catch (Exception e) {
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
    public ResponseEntity<String> saveUserWithInfo(@RequestBody Map<String, Users> payload) {
        System.out.println("Payload received: " + payload); // Log payload
        try {
            Users user = payload.get("user"); // Basic user info
            System.out.println("User received: " + user); // Log payload
            Users additionalInfo = payload.get("additionalInfo"); // Additional information
            System.out.println("Info received: " + additionalInfo); // Log payload
            userServices.saveUser(user, additionalInfo);
            return new ResponseEntity<>("User saved successfully. Please verify your email.", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to save user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
