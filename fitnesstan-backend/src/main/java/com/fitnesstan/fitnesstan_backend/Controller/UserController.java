package com.fitnesstan.fitnesstan_backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.fitnesstan.fitnesstan_backend.DAO.UserRepository;
import com.fitnesstan.fitnesstan_backend.Entity.Users;
import com.fitnesstan.fitnesstan_backend.Services.UserServices;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserServices userServices;

    @Autowired
    private UserRepository userRepository;

    // Endpoint to fetch data for a specific user by email
    @GetMapping("/{email}")
    public ResponseEntity<Users> getUserByEmail(@PathVariable String email) {
        Users user = userRepository.findByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint to update user details
    @PutMapping
    public ResponseEntity<String> updateUser(@RequestBody Users updatedUser) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName(); // Get logged-in username
        Users existingUser = userServices.findByUsername(username);

        if (existingUser == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        try {
            // Update allowed fields
            if (updatedUser.getUsername() != null && !updatedUser.getUsername().isEmpty()) {
                existingUser.setUsername(updatedUser.getUsername());
            }

            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                existingUser.setPassword(userServices.encodePassword(updatedUser.getPassword())); // Use your encoding
                                                                                                  // method
            }

            if (updatedUser.getHeightFt() != null) {
                existingUser.setHeightFt(updatedUser.getHeightFt());
            }

            if (updatedUser.getWeightKg() != null) {
                existingUser.setWeightKg(updatedUser.getWeightKg());
            }

            if (updatedUser.getGender() != null && !updatedUser.getGender().isEmpty()) {
                existingUser.setGender(updatedUser.getGender());
            }

            if (updatedUser.getDob() != null) {
                existingUser.setDob(updatedUser.getDob());
            }

            if (updatedUser.getOccupation() != null && !updatedUser.getOccupation().isEmpty()) {
                existingUser.setOccupation(updatedUser.getOccupation());
            }

            if (updatedUser.getReligion() != null && !updatedUser.getReligion().isEmpty()) {
                existingUser.setReligion(updatedUser.getReligion());
            }

            if (updatedUser.getExerciseLevel() != null && !updatedUser.getExerciseLevel().isEmpty()) {
                existingUser.setExerciseLevel(updatedUser.getExerciseLevel());
            }

            if (updatedUser.getSleepHours() != null) {
                existingUser.setSleepHours(updatedUser.getSleepHours());
            }

            if (updatedUser.getMedicalHistory() != null) {
                existingUser.setMedicalHistory(updatedUser.getMedicalHistory());
            }

            // Save updated user
            userServices.saveUserToDatabase(existingUser);
            return new ResponseEntity<>("User updated successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to update user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint to delete the user
    @DeleteMapping
    public ResponseEntity<String> deleteUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        try {
            Users user = userServices.findByUsername(username);
            if (user == null) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }

            userRepository.deleteById(user.getId()); // Use appropriate method based on your repository implementation
            return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to delete user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // In UserController.java
    @PostMapping("/demo-diet/{userId}")
    public ResponseEntity<String> addDemoDietPlan(@PathVariable String userId) {
        try {
            userServices.addDemoMealsForUserAndReturn(userId);
            return ResponseEntity.ok("Demo diet plan added successfully for user with id: " + userId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Failed to add demo diet plan: " + e.getMessage());
        }
    }

}
