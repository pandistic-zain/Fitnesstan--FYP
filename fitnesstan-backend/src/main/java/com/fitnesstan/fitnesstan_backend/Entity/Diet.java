package com.fitnesstan.fitnesstan_backend.Entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import org.bson.types.ObjectId;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "diets")
public class Diet {
    
    @Id
    private ObjectId id;
    
    @DBRef
    private Users user; // Reference to the Users entity
    
    /**
     * A dynamic mapping for the 14-day meal plan.
     * The outer map's key is the day number (1 to 14).
     * The inner map maps meal names (e.g., "meal1", "meal2") to a list of food items.
     */
    private Map<Integer, Map<String, List<String>>> mealPlan;
    
    // The starting date of the 14-day diet plan.
    private LocalDate startDate;
    
    // The end date (startDate plus 14 days).
    private LocalDate endDate;
    
    // Optionally, you could add additional fields (e.g., status) to mark if the diet is active/expired.
}
