package com.fitnesstan.fitnesstan_backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.fitnesstan.fitnesstan_backend.Entity.Users;  // Adjust import based on your UserEntity class
import com.fitnesstan.fitnesstan_backend.Services.UserServices;

@RestController
@RequestMapping("/admin")
public class AdminController {
    
    @Autowired
    private UserServices userServices;

    // Endpoint to get all users
    @GetMapping("/all-users")
    public ResponseEntity<List<Users>> getAllUsers() {
        List<Users> allUsers = userServices.getAllUsers(); // Adjust based on your service implementation
        if (allUsers != null && !allUsers.isEmpty()) {
            return new ResponseEntity<>(allUsers, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Endpoint to create an admin user
    @PostMapping("/create-admin")
    public ResponseEntity<String> createAdminUser(@RequestBody Users user) { // Adjust if your entity class is named differently
        try {
            userServices.createAdmin(user); // Ensure this method is implemented in your service
            return new ResponseEntity<>("Admin user created successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to create admin: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
