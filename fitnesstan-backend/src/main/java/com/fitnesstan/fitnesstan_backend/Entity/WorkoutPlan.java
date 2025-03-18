package com.fitnesstan.fitnesstan_backend.Entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

import org.springframework.data.mongodb.core.mapping.DBRef;
import org.bson.types.ObjectId;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "workout_plans")
@ToString(exclude = "user")
public class WorkoutPlan {

    @Id
    private ObjectId id;

    @DBRef
    @JsonIgnore
    private Users user;  // Reference to the User who owns this plan

    private String planName;    // e.g. "14-Day Plan"
    private LocalDate startDate;
    private LocalDate endDate;  // Exactly 14 days from start

    // Each day has a list of exercises
    private List<DayPlan> dayPlans;
}
