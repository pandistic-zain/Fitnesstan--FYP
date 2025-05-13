package com.fitnesstan.fitnesstan_backend.Controller;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitnesstan.fitnesstan_backend.DAO.UserRepository;
import com.fitnesstan.fitnesstan_backend.Entity.Users;
import com.fitnesstan.fitnesstan_backend.Services.UserServices;

@RestController
@CrossOrigin(origins = "http://localhost:3000")

@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserServices userServices;
    @Autowired
    private UserRepository userRepository;

    // Endpoint to get all users
    @GetMapping("/all-users")
    public ResponseEntity<List<Users>> getAllUsers() {
        List<Users> allUsers = userServices.getAllUsers();
        if (allUsers.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(allUsers, HttpStatus.OK); // Make sure this sends an array of users
    }

    // Endpoint to deactivate (delete) a user // Endpoint to deactivate (delete) a
    // user
    @DeleteMapping("/deactivate-user/{id}")
    public ResponseEntity<String> deactivateUser(@PathVariable String id) {
        try {
            System.out.println("Deactivating user with ID: " + id); // Log the incoming userId

            // Convert the string userId (id from the frontend) to MongoDB ObjectId
            ObjectId objectId = new ObjectId(id);

            // Fetch the user by ID using the userRepository
            Users currentUser = userRepository.findById(objectId).orElse(null);

            if (currentUser == null) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND); // Handle user not found
            }

            // Check if the current user has the 'ADMIN' role
            if (currentUser.getRoles().contains("ADMIN")) {
                return new ResponseEntity<>("Admin users cannot be deactivated", HttpStatus.FORBIDDEN); // Prevent
                                                                                                        // deactivating
                                                                                                        // admin
            }

            // Proceed with deactivating the user if the role is 'USER'
            boolean deleted = userServices.deleteUser(id); // Call the service to delete the user

            if (deleted) {
                return new ResponseEntity<>("User deactivated successfully", HttpStatus.OK); // Success
            } else {
                return new ResponseEntity<>("Failed to deactivate user", HttpStatus.BAD_REQUEST); // Failure
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to deactivate user: " + e.getMessage(), HttpStatus.BAD_REQUEST); // Error
                                                                                                                 // handling
        }
    }

    // Endpoint to delete feedback by ID
    // Endpoint to delete feedback by ID
    @DeleteMapping("/feedback/{id}")
    public ResponseEntity<String> deleteFeedback(@PathVariable String id) {
        try {
            // Pass id to service, delete feedback
            boolean deleted = userServices.deleteFeedbackById(id);
            if (deleted) {
                return new ResponseEntity<>("Feedback deleted successfully", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Feedback not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            // Error handling in case of failure
            return new ResponseEntity<>("Failed to delete feedback: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/update-user/{id}")
    public ResponseEntity<String> updateUser(
            @PathVariable String id,
            @RequestBody Users user) {
        boolean ok = userServices.updateUser(id, user);
        return ok
                ? ResponseEntity.ok("User updated successfully")
                : ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }
}
