package com.fitnesstan.fitnesstan_backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.fitnesstan.fitnesstan_backend.DAO.UserRepository;
import com.fitnesstan.fitnesstan_backend.Entity.Users;
import com.fitnesstan.fitnesstan_backend.Entity.Diet;
import com.fitnesstan.fitnesstan_backend.Entity.WorkoutPlan;
import com.fitnesstan.fitnesstan_backend.DTO.FullUserInfoDTO;
import com.fitnesstan.fitnesstan_backend.Services.UserServices;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserServices userServices;

    @Autowired
    private UserRepository userRepository;

    // Endpoint to fetch basic user information by email
    @GetMapping("/{email}")
    public ResponseEntity<Users> getUserByEmail(@PathVariable String email) {
        Users user = userRepository.findByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // New endpoint to fetch full user information (user + diet + workout plan)
    @GetMapping("/full/{email}")
    public ResponseEntity<?> getFullUserInfo(@PathVariable String email) {
        Users user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        // Retrieve diet and workout plan information.
        Diet diet = user.getCurrentDiet();          // Ensure this is correctly mapped.
        WorkoutPlan workoutPlan = user.getCurrentWorkoutPlan(); // Ensure this is correctly mapped.
        FullUserInfoDTO fullInfo = new FullUserInfoDTO(user, diet, workoutPlan);
        return ResponseEntity.ok(fullInfo);
    }

    // Update user details
    @PutMapping
    public ResponseEntity<String> updateUser(@RequestBody Users updatedUser) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Users existingUser = userServices.findByUsername(username);

        if (existingUser == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        try {
            if (updatedUser.getUsername() != null && !updatedUser.getUsername().isEmpty()) {
                existingUser.setUsername(updatedUser.getUsername());
            }
            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                existingUser.setPassword(userServices.encodePassword(updatedUser.getPassword()));
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

            userServices.saveUserToDatabase(existingUser);
            return new ResponseEntity<>("User updated successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to update user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete the current user
    @DeleteMapping
    public ResponseEntity<String> deleteUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        try {
            Users user = userServices.findByUsername(username);
            if (user == null) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }
            userRepository.deleteById(user.getId());
            return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to delete user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
