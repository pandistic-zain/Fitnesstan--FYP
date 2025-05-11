// src/main/java/com/fitnesstan/fitnesstan_backend/Entity/Feedback.java
package com.fitnesstan.fitnesstan_backend.Entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.bson.types.ObjectId;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "feedbacks")
public class Feedback {
    @Id
    private ObjectId id;

    private String name;
    private String email;
    /**
     * Matches the JSON key `"feedback"` that your front-end is sending
     */
    private String feedback;


    // Automatically set when you build/save
    private LocalDateTime submittedAt;
}
