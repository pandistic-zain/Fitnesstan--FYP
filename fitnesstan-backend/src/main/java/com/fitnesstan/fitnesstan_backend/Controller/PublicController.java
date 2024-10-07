package com.fitnesstan.fitnesstan_backend.Controller; // Adjust package as needed

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.fitnesstan.fitnesstan_backend.Entity.Users; // Ensure this points to your Users entity
import com.fitnesstan.fitnesstan_backend.Services.UserServices; // Ensure this points to your UserServices

@RestController
@RequestMapping("/public") // Base path for public endpoints
public class PublicController {

    @Autowired
    private UserServices userServices; // Injecting UserServices

    // Health check endpoint
    @GetMapping("/health-check")
    public ResponseEntity<String> healthCheck() {
        return new ResponseEntity<>("OK", HttpStatus.OK);
    }

    // User creation endpoint
    @PostMapping("/create-user")
    public ResponseEntity<String> saveUser(@RequestBody Users user) { // Changed UserEntity to Users
        try {
            userServices.saveUser(user); // Assuming saveUser method in UserServices takes Users object
            return new ResponseEntity<>("User saved successfully", HttpStatus.CREATED); // Changed status to CREATED
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to save user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
