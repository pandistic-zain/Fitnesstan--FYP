package com.fitnesstan.fitnesstan_backend.Entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealItem {
    private String name;      // Name of the food item
    private double protein;   // Protein content in grams
    private double carbs;     // Carbohydrates content in grams
    private double fats;      // Fats content in grams
    private double calories;  // Calories count of the food item
    private double weight;    // Weight of the food item (in grams)
}
