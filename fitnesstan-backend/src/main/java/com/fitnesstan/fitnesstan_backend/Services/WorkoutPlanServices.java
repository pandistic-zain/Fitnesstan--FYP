package com.fitnesstan.fitnesstan_backend.Services;

import com.fitnesstan.fitnesstan_backend.DAO.UserRepository;
import com.fitnesstan.fitnesstan_backend.DAO.ExerciseRepository;
import com.fitnesstan.fitnesstan_backend.DAO.WorkoutPlanRepository;
import com.fitnesstan.fitnesstan_backend.Entity.Users;
import com.fitnesstan.fitnesstan_backend.Entity.Exercise;
import com.fitnesstan.fitnesstan_backend.Entity.WorkoutPlan;
import com.fitnesstan.fitnesstan_backend.Entity.DayPlan;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Service
public class WorkoutPlanServices {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkoutPlanRepository workoutPlanRepository;

    @Autowired
    private ExerciseRepository exerciseRepository;

    /**
     * Generate a 14-day workout plan for the given user based on user's exerciseLevel.
     */
    public WorkoutPlan generateWorkoutPlan(String userId) throws Exception {
        Users user = userRepository.findById(new ObjectId(userId))
                .orElseThrow(() -> new Exception("User not found with id: " + userId));
        String exerciseLevel = user.getExerciseLevel(); // e.g., "7 days a week", "5 days a week", etc.

        // Fetch all exercises from DB.
        List<Exercise> allExercises = exerciseRepository.findAll();

        // Build the 14-day workout plan according to the user's exercise level.
        List<DayPlan> dayPlans = buildDayPlansBasedOnLevel(exerciseLevel, allExercises);

        // Create and save the workout plan.
        WorkoutPlan workoutPlan = WorkoutPlan.builder()
                .user(user)
                .planName("14-Day Plan for " + user.getUsername())
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusDays(13))
                .dayPlans(dayPlans)
                .build();
        WorkoutPlan savedPlan = workoutPlanRepository.save(workoutPlan);

        return savedPlan;
    }

    /**
     * Build day-by-day plan based on the user's exercise level and the list of all exercises.
     * The plan is always 14 days long.
     */
    private List<DayPlan> buildDayPlansBasedOnLevel(String exerciseLevel, List<Exercise> allExercises) {
        List<DayPlan> dayPlans = new ArrayList<>();
        // Extract the numeric part from the exerciseLevel string.
        int levelNum = Integer.parseInt(exerciseLevel.split(" ")[0]);

        switch (levelNum) {
            case 7: {
                // 7 days a week: each day is a workout day.
                // Use this sequence: ["Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Cardio"]
                String[] groups7 = {"Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Cardio"};
                for (int day = 1; day <= 14; day++) {
                    String group = groups7[(day - 1) % 7];
                    List<Exercise> exercisesForDay = selectExercisesForGroup(group, 8, allExercises);
                    DayPlan dp = DayPlan.builder().dayNumber(day).exercises(exercisesForDay).build();
                    dayPlans.add(dp);
                }
                break;
            }
            case 6: {
                // 6 days a week: workout 6 days, 1 rest day per week.
                // For 14 days: week1: days 1-6 workout, day 7 rest; week2: days 8-13 workout, day 14 rest.
                String[] groups6 = {"Chest", "Back", "Shoulders", "Arms", "Legs", "Core"};
                for (int day = 1; day <= 14; day++) {
                    if (day % 7 == 0) {
                        // Rest day.
                        dayPlans.add(DayPlan.builder().dayNumber(day).exercises(new ArrayList<>()).build());
                    } else {
                        String group = groups6[(day - 1) % 6];
                        List<Exercise> exercisesForDay = selectExercisesForGroup(group, 8, allExercises);
                        dayPlans.add(DayPlan.builder().dayNumber(day).exercises(exercisesForDay).build());
                    }
                }
                break;
            }
            case 5: {
                // 5 days a week: 5 workout days and 2 rest days per week.
                // Workout days are:
                // Day1: "Chest+Arms", Day2: "Back+Arms", Day3: "Shoulders", Day4: "Legs", Day5: "Core".
                // For days with two groups, select 4 exercises per group (total 8).
                String[] groups5 = {"Chest+Arms", "Back+Arms", "Shoulders", "Legs", "Core"};
                // For 14 days, pattern: Week1: days1-5 workout, days6-7 rest; Week2: days8-12 workout, days13-14 rest.
                for (int day = 1; day <= 14; day++) {
                    int dayInWeek = (day - 1) % 7 + 1;
                    if (dayInWeek > 5) {
                        // Rest day.
                        dayPlans.add(DayPlan.builder().dayNumber(day).exercises(new ArrayList<>()).build());
                    } else {
                        int index = (day <= 7) ? day - 1 : day - 8; // 0-based index for the workout day of the week.
                        String group = groups5[index];
                        List<Exercise> exercisesForDay;
                        if (group.contains("+")) {
                            String[] parts = group.split("\\+");
                            List<Exercise> group1 = selectExercisesForGroup(parts[0].trim(), 4, allExercises);
                            List<Exercise> group2 = selectExercisesForGroup(parts[1].trim(), 4, allExercises);
                            exercisesForDay = new ArrayList<>();
                            exercisesForDay.addAll(group1);
                            exercisesForDay.addAll(group2);
                        } else {
                            exercisesForDay = selectExercisesForGroup(group, 8, allExercises);
                        }
                        dayPlans.add(DayPlan.builder().dayNumber(day).exercises(exercisesForDay).build());
                    }
                }
                break;
            }
            case 4: {
                // 4 days a week: 4 workout days, 3 rest days per week.
                // Workout days: Day1: "Chest+Arms", Day2: "Back+Arms", Day3: "Shoulders+Arms", Day4: "Legs+Core".
                String[] groups4 = {"Chest+Arms", "Back+Arms", "Shoulders+Arms", "Legs+Core"};
                // For 14 days, week1: days1-4 workout, days5-7 rest; week2: days8-11 workout, days12-14 rest.
                for (int day = 1; day <= 14; day++) {
                    int dayInWeek = (day - 1) % 7 + 1;
                    if (dayInWeek > 4) {
                        // Rest day.
                        dayPlans.add(DayPlan.builder().dayNumber(day).exercises(new ArrayList<>()).build());
                    } else {
                        int index = (day <= 7) ? day - 1 : day - 8;
                        String group = groups4[index];
                        List<Exercise> exercisesForDay;
                        if (group.contains("+")) {
                            String[] parts = group.split("\\+");
                            List<Exercise> group1 = selectExercisesForGroup(parts[0].trim(), 4, allExercises);
                            List<Exercise> group2 = selectExercisesForGroup(parts[1].trim(), 4, allExercises);
                            exercisesForDay = new ArrayList<>();
                            exercisesForDay.addAll(group1);
                            exercisesForDay.addAll(group2);
                        } else {
                            exercisesForDay = selectExercisesForGroup(group, 8, allExercises);
                        }
                        dayPlans.add(DayPlan.builder().dayNumber(day).exercises(exercisesForDay).build());
                    }
                }
                break;
            }
            default: {
                // For level 3, 2, or 1: Full-body workout design.
                // Each workout day will have 7 exercises (one from each of the following groups):
                // ["Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Cardio"]
                String[] fullBodyGroups = {"Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Cardio"};
                // Workouts per week = levelNum. For a 14-day plan, fill each week accordingly.
                int workoutsPerWeek = levelNum; // e.g., if level==3, then 3 workout days per week.
                for (int day = 1; day <= 14; day++) {
                    int dayInWeek = (day - 1) % 7 + 1;
                    if (dayInWeek <= workoutsPerWeek) {
                        List<Exercise> exercisesForDay = new ArrayList<>();
                        // For full-body, pick one exercise per group.
                        for (String group : fullBodyGroups) {
                            List<Exercise> selected = selectExercisesForGroup(group, 1, allExercises);
                            if (!selected.isEmpty()) {
                                exercisesForDay.add(selected.get(0));
                            }
                        }
                        dayPlans.add(DayPlan.builder().dayNumber(day).exercises(exercisesForDay).build());
                    } else {
                        // Rest day.
                        dayPlans.add(DayPlan.builder().dayNumber(day).exercises(new ArrayList<>()).build());
                    }
                }
                break;
            }
        }

        return dayPlans;
    }

    /**
     * Helper method to select a specific number of exercises for a given group from allExercises.
     * Returns up to 'count' exercises that match the group (case-insensitive).
     */
    private List<Exercise> selectExercisesForGroup(String group, int count, List<Exercise> allExercises) {
        List<Exercise> filtered = new ArrayList<>();
        for (Exercise ex : allExercises) {
            if (ex.getMuscleGroup() != null && ex.getMuscleGroup().equalsIgnoreCase(group)) {
                filtered.add(ex);
            }
        }
        // If more than 'count' exercises available, return the first 'count'.
        if (filtered.size() > count) {
            return filtered.subList(0, count);
        }
        return filtered;
    }
}
