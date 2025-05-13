// src/main/java/com/fitnesstan/fitnesstan_backend/DAO/FeedbackRepository.java
package com.fitnesstan.fitnesstan_backend.DAO;

import com.fitnesstan.fitnesstan_backend.Entity.Feedback;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.bson.types.ObjectId;

@Repository
public interface FeedbackRepository extends MongoRepository<Feedback, ObjectId> {
}
