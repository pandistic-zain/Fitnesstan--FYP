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

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "workout_plans")
public class WorkoutPlan {

    @Id
    private ObjectId id;

    @DBRef
    private Users user;  // Reference the User who owns this plan

    private String planName;  // e.g., "Full Body 3-Day Split", "6-Day Bro Split", etc.
    private LocalDate startDate;
    private LocalDate endDate; // 14-day plan

    // A list of days, each day containing a list of exercises
    private List<DayPlan> dayPlans;
}
