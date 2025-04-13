package com.fitnesstan.fitnesstan_backend.DAO;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.fitnesstan.fitnesstan_backend.Entity.Exercise;

public interface ExerciseRepository extends MongoRepository<Exercise, ObjectId> {
    // For example, if you want to check by name:
    boolean existsByName(String name);

    // Or if you store the API's exercise ID in a custom field (e.g., apiId), you can do:
    // boolean existsByApiId(String apiId);
}
