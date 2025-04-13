package com.fitnesstan.fitnesstan_backend.DAO;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.fitnesstan.fitnesstan_backend.Entity.Diet;

public interface DietRepository extends MongoRepository<Diet, ObjectId> {
    // Add custom query methods here if needed
}
