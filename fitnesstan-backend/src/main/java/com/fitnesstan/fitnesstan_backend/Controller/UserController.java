package com.fitnesstan.fitnesstan_backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.fitnesstan.fitnesstan_backend.DAO.UserRepository;
import com.fitnesstan.fitnesstan_backend.Entity.Users;  // Adjust import based on your UserEntity class
import com.fitnesstan.fitnesstan_backend.Services.UserServices;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserServices userServices;

    @Autowired
    private UserRepository userRepository;

    // Endpoint to update the user details
    @PutMapping
    public ResponseEntity<String> updateUser(@RequestBody Users user) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Users userInDb = userServices.findByUsername(username);  // Ensure this method is implemented in your service

        try {
            userInDb.setUsername(user.getUsername());
            userInDb.setPassword(user.getPassword());
            userServices.saveUser(userInDb); // Ensure saveUser method is implemented in your service
            return new ResponseEntity<>("Update User Successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to Update User: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint to delete the user
    @DeleteMapping
    public ResponseEntity<String> deleteUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        try {
            userRepository.deleteByUsername(username);  // Ensure this method is implemented in your repository
            return new ResponseEntity<>("User Deleted Successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to Delete User: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
