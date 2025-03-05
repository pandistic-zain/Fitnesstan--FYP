package com.fitnesstan.fitnesstan_backend.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.bson.types.ObjectId;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fitnesstan.fitnesstan_backend.DAO.UserRepository;
import com.fitnesstan.fitnesstan_backend.DAO.ExerciseRepository; // now assumed to manage Exercise entities
import com.fitnesstan.fitnesstan_backend.DAO.WorkoutPlanRepository;   // for WorkoutPlan
import com.fitnesstan.fitnesstan_backend.Entity.Users;
import com.fitnesstan.fitnesstan_backend.Entity.Exercise;
import com.fitnesstan.fitnesstan_backend.Entity.WorkoutPlan;
import com.fitnesstan.fitnesstan_backend.Entity.DayPlan;

@Service
public class WorkoutPlanServices {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkoutPlanRepository workoutPlanRepository;

    // Renamed variable for clarity; this repository should manage Exercise entities
    @Autowired
    private ExerciseRepository exerciseRepository;

    /**
     * Generate a 14-day workout plan for the given user based on user's exerciseLevel.
     */
    public WorkoutPlan generateWorkoutPlan(String userId) throws Exception {
        Users user = userRepository.findById(new ObjectId(userId))
                .orElseThrow(() -> new Exception("User not found with id: " + userId));

        String exerciseLevel = user.getExerciseLevel(); 
        // e.g. "1 days a week", "3 days a week", "6 days a week", etc.

        // 1) Fetch all exercises from DB
        List<Exercise> allExercises = exerciseRepository.findAll();

        // 2) Build 14-day plan logic
        List<DayPlan> dayPlans = buildDayPlansBasedOnLevel(exerciseLevel, allExercises);

        // 3) Create new WorkoutPlan object
        WorkoutPlan workoutPlan = WorkoutPlan.builder()
                .user(user)
                .planName("14-Day Plan for " + user.getUsername())
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusDays(13))
                .dayPlans(dayPlans)
                .build();

        // 4) Save plan to DB
        WorkoutPlan savedPlan = workoutPlanRepository.save(workoutPlan);

        // (Optional) If you want to store a reference in the User object
        // user.setCurrentWorkoutPlan(savedPlan);
        // userRepository.save(user);

        return savedPlan;
    }

    /**
     * Helper method to build day-by-day plan from user’s exerciseLevel.
     */
    private List<DayPlan> buildDayPlansBasedOnLevel(String exerciseLevel, List<Exercise> allExercises) {
        List<DayPlan> dayPlans = new ArrayList<>();
        
        // For instance, if a user works out "3 days a week", over 14 days that equates to 6 workout days.
        int totalWorkoutDays = parseWorkoutDays(exerciseLevel); 
        
        // For demonstration, we'll sequentially assign workout days;
        // In a more advanced logic you might spread them evenly across the 14 days.
        int workoutDayCount = 0;
        for (int i = 1; i <= 14; i++) {
            List<Exercise> dailyExercises = new ArrayList<>();
            // Only assign workouts if we haven't reached the total workout days
            if (workoutDayCount < totalWorkoutDays) {
                dailyExercises = pickSomeExercises(allExercises);
                workoutDayCount++;
            }
            DayPlan dp = DayPlan.builder()
                    .dayNumber(i)
                    .exercises(dailyExercises)
                    .build();
            dayPlans.add(dp);
        }
        return dayPlans;
    }

    private List<Exercise> pickSomeExercises(List<Exercise> allExercises) {
        // In real logic, filter by muscle group or user preference.
        // For demo, simply pick the first exercise if available.
        List<Exercise> subset = new ArrayList<>();
        if (!allExercises.isEmpty()) {
            subset.add(allExercises.get(0)); // simplest possible approach
        }
        return subset;
    }

    private int parseWorkoutDays(String exerciseLevel) {
        // Expecting a format like "6 days a week". For a 14-day plan,
        // multiply the per-week workout days by 2.
        String daysStr = exerciseLevel.split(" ")[0]; // e.g. "6"
        int daysPerWeek = Integer.parseInt(daysStr);
        return daysPerWeek * 2;
    }
}
