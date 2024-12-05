package com.fitnesstan.fitnesstan_backend.Entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users") // Map this class to the "users" collection in MongoDB
public class Users {
    @Id
    private ObjectId id; // Consider using String if preferred

    private String username;

    @Indexed(unique = true)

    private String email;

    private String password;

    private List<String> roles; // e.g., ADMIN, USER

    private String status; // e.g., "PENDING", "ACTIVE"

    private String verificationToken;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
    private Double heightFt; // Height in feet
    private LocalDate dob; // Date of Birth

    private Double weightKg; // Weight in kilograms
    private String gender; // Consider using an Enum for predefined values
    private String occupation;
    private String religion;
    private String exerciseLevel; // Consider using an Enum (e.g., LOW, MEDIUM, HIGH)
    private Double sleepHours; // Average sleep hours per night

    private List<String> medicalHistory; // List of medical conditions
}
