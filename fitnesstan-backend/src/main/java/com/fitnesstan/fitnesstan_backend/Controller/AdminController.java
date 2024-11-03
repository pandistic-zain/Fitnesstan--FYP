package com.fitnesstan.fitnesstan_backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitnesstan.fitnesstan_backend.Entity.Users;
import com.fitnesstan.fitnesstan_backend.Services.UserServices;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private UserServices userServices;

    // Endpoint to get all users
    @GetMapping("/all-users")
    public ResponseEntity<List<Users>> getAllUsers() {
        List<Users> allUsers = userServices.getAllUsers();
        return allUsers.isEmpty() 
            ? new ResponseEntity<>(HttpStatus.NOT_FOUND)
            : new ResponseEntity<>(allUsers, HttpStatus.OK);
    }

    // Endpoint to create an admin user
    @PostMapping("/create-admin")
    public ResponseEntity<String> createAdminUser(@RequestBody Users user) {
        try {
            userServices.createAdmin(user);
            return new ResponseEntity<>("Admin user created successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to create admin: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Endpoint to update a user's information
    @PutMapping("/update-user/{id}")
    public ResponseEntity<String> updateUser(@PathVariable String id, @RequestBody Users user) {
        try {
            boolean updated = userServices.updateUser(id, user);
            return updated
                ? new ResponseEntity<>("User updated successfully", HttpStatus.OK)
                : new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to update user: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Endpoint to deactivate or delete a user
    @DeleteMapping("/delete-user/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable String id) {
        try {
            boolean deleted = userServices.deleteUser(id);
            return deleted
                ? new ResponseEntity<>("User deactivated successfully", HttpStatus.OK)
                : new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to deactivate user: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
