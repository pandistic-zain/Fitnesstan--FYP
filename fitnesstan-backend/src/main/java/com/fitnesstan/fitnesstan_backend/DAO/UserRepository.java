package com.fitnesstan.fitnesstan_backend.DAO;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.fitnesstan.fitnesstan_backend.Entity.Users;

public interface UserRepository extends MongoRepository<Users, ObjectId> {
    // Removed Optional and returning Users directly
    Users findByUsername(String username);  // This may return null if not found
    Users findByEmail(String email);        // This may return null if not found
    void deleteById(String id);
}
