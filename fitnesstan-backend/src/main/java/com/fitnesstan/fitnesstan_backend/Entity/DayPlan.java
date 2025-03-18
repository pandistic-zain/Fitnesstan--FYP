package com.fitnesstan.fitnesstan_backend.Entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.DBRef;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString // No cycles here if it doesn't reference Users or WorkoutPlan
public class DayPlan {
    private int dayNumber; // e.g., 1 through 14
    
    // A list of exercises associated with this day
    @DBRef
    @JsonIgnore
    private List<Exercise> exercises;
}
