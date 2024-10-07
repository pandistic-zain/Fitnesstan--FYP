package com.fitnesstan.fitnesstan_backend.Services;

import java.util.Arrays;
import java.util.List;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.fitnesstan.fitnesstan_backend.Entity.Users;
import com.fitnesstan.fitnesstan_backend.DAO.UserRepository;

@Service
public class UserServices {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MongoTemplate mongoTemplate;

    private static final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    public Users saveUser(Users user) throws Exception {

        // Proceed to save user
        try {
            // Check if username already exists
            Query queryByUsername = new Query(Criteria.where("username").is(user.getUsername()));
            boolean usernameExists = mongoTemplate.exists(queryByUsername, Users.class);
            if (usernameExists) {
                throw new Exception("User with the same username already exists.");
            }

            // Check if email already exists
            Query queryByEmail = new Query(Criteria.where("email").is(user.getEmail()));
            boolean emailExists = mongoTemplate.exists(queryByEmail, Users.class);
            if (emailExists) {
                throw new Exception("User with the same email already exists.");
            }
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setRoles(Arrays.asList("USER"));
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            return userRepository.save(user);
        } catch (Exception e) {
            throw new Exception("User with the same username or email already exists.");
        }
    }

    public Users createAdmin(Users user) throws Exception {
        try {
            // Check if username already exists
            Query queryByUsername = new Query(Criteria.where("username").is(user.getUsername()));
            boolean usernameExists = mongoTemplate.exists(queryByUsername, Users.class);
            if (usernameExists) {
                throw new Exception("Admin with the same username already exists.");
            }

            // Check if email already exists
            Query queryByEmail = new Query(Criteria.where("email").is(user.getEmail()));
            boolean emailExists = mongoTemplate.exists(queryByEmail, Users.class);
            if (emailExists) {
                throw new Exception("Admin with the same email already exists.");
            }
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setRoles(Arrays.asList("ADMIN"));
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            return userRepository.save(user);
        } catch (Exception e) {
            throw new Exception("User with the same username or email already exists.");
        }
    }

    public Users findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    public Users validateUser(String email, String password) {
        // Fetch the user by email from the repository
        Users user = userRepository.findByEmail(email); // Assuming you have this method in your UserRepository

        // Check if the user exists
        if (user != null) {
            // Use BCrypt to match the raw password with the encoded password
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user; // Return user if credentials are valid
            }
        }

        return null; // Return null if credentials are invalid
    }

}
