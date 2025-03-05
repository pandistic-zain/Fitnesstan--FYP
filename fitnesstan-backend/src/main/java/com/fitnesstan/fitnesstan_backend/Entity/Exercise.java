package com.fitnesstan.fitnesstan_backend.Entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.bson.types.ObjectId;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "exercises")
public class Exercise {

    @Id
    private ObjectId id; // MongoDB ObjectId

    private String name;            // e.g., "Bench Press"
    private String muscleGroup;     // e.g., "Chest"
    private String gifUrl;          // link or path to a GIF demonstrating the exercise
    private String description;     // brief instructions or technique tips

    // Additional optional fields
    private String equipment;     // e.g., "Dumbbell", "Barbell", "Bodyweight"
}
