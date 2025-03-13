package com.fitnesstan.fitnesstan_backend.DTO;

import com.fitnesstan.fitnesstan_backend.Entity.Users;
import com.fitnesstan.fitnesstan_backend.Entity.Diet;
import com.fitnesstan.fitnesstan_backend.Entity.WorkoutPlan;

public class FullUserInfoDTO {
    private Users user;
    private Diet diet;
    private WorkoutPlan workoutPlan;

    public FullUserInfoDTO(Users user, Diet diet, WorkoutPlan workoutPlan) {
        this.user = user;
        this.diet = diet;
        this.workoutPlan = workoutPlan;
    }

    // Getters and setters
    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public Diet getDiet() {
        return diet;
    }

    public void setDiet(Diet diet) {
        this.diet = diet;
    }

    public WorkoutPlan getWorkoutPlan() {
        return workoutPlan;
    }

    public void setWorkoutPlan(WorkoutPlan workoutPlan) {
        this.workoutPlan = workoutPlan;
    }
}
