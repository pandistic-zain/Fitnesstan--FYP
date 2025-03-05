package com.fitnesstan.fitnesstan_backend.DAO;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.fitnesstan.fitnesstan_backend.Entity.Exercise;

public interface ExerciseRepository extends MongoRepository<Exercise, ObjectId> {
    // Add custom query methods here if needed
}
