package com.fitnesstan.fitnesstan_backend.Entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import com.fasterxml.jackson.annotation.JsonIgnore;

import org.bson.types.ObjectId;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users")
public class Users {

    @Id
    private ObjectId id; // MongoDB ObjectId for user

    private String username;

    @Indexed(unique = true)
    private String email;

    private String password;

    private List<String> roles; // e.g., ADMIN, USER

    private String status; // e.g., "PENDING", "ACTIVE"

    private String verificationToken;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Personal and Health Information
    private Double heightFt; // Height in feet
    private LocalDate dob; // Date of Birth
    private Double weightKg; // Weight in kilograms
    private String gender; // Enum for predefined gender values
    private String occupation;
    private String religion;
    private String exerciseLevel; // Enum for predefined exercise levels
    private Double sleepHours; // Average sleep hours per night
    private List<String> medicalHistory; // List of medical conditions

    // Calculated Fields
    private Double bmi; // Body Mass Index
    private Double ree; // Resting Metabolic Rate
    private Double tdee; // Total Daily Energy Expenditure

    // Mapping to Diet entity via DBRef to link the current 14-day diet plan
    @DBRef
    @JsonIgnore 
    private Diet currentDiet;
}
