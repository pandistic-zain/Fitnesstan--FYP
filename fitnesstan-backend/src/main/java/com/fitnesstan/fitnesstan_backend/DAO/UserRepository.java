package com.fitnesstan.fitnesstan_backend.DAO;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.fitnesstan.fitnesstan_backend.Entity.Users;

public interface UserRepository extends MongoRepository<Users, ObjectId> {
    // Removed Optional and returning Users directly
    Users findByUsername(String username);  
    Users findByEmail(String email);      
    void deleteById(String id);
    void deleteByUsername(String username);
    Users findByVerificationToken(String token);
}
