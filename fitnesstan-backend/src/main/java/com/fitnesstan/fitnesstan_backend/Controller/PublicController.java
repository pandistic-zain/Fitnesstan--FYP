package com.fitnesstan.fitnesstan_backend.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fitnesstan.fitnesstan_backend.DAO.UserRepository;
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
    @PostMapping("/change-item")
    public ResponseEntity<String> changeItemFromCluster(@RequestBody Map<String, Object> userRequestData) {
        try {
            // Debugging: log the incoming request data to ensure correct format
            System.out.println("[DEBUG] Received request data for item change: " + userRequestData);
    
            // Check if the required fields are present
            if (!userRequestData.containsKey("userId") || !userRequestData.containsKey("itemName")) {
                return ResponseEntity.badRequest().body("Missing required fields: userId or itemName");
            }
    
            // Extract data from the request
            String userId = (String) userRequestData.get("userId");
            String itemName = (String) userRequestData.get("itemName");
    
            System.out.println("[DEBUG] userId: " + userId + ", itemName: " + itemName);
    
            // Call the service method to process the change
            boolean isItemChanged = userServices.changeItemFromCluster(userRequestData);
    
            if (isItemChanged) {
                return ResponseEntity.ok("Item successfully changed from cluster.");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to change item.");
            }
        } catch (Exception e) {
            // Debugging: log any exceptions encountered during the process
            System.out.println("[DEBUG] Error during item change: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
}