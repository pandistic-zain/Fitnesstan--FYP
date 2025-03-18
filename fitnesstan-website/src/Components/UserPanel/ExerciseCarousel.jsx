// src/components/ExerciseCarousel.jsx
import React, { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import { getFullUserData } from "../../API/RegisterAPI";
import styles from "./ExerciseCarousel.module.css";

const ExerciseCarousel = () => {
  const [dayPlans, setDayPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.debug("[DEBUG] Fetching full user data from /user/full...");

    getFullUserData()
      .then((response) => {
        // If your getFullUserData() returns the *full Axios response*, 
        // then you'd do: const dto = response.data
        // If it returns the direct data object, just use 'response'
        const dto = response.data; 

        console.debug("[DEBUG] Raw full user data:", JSON.stringify(dto, null, 2));

        // Safely access the workoutPlan property from your DTO
        const workoutPlan = dto?.workoutPlan;
        if (workoutPlan && Array.isArray(workoutPlan.dayPlans)) {
          console.debug(
            "[DEBUG] Workout plan found with",
            workoutPlan.dayPlans.length,
            "day plans"
          );
          setDayPlans(workoutPlan.dayPlans);
        } else {
          console.warn("[WARN] No workout plan or dayPlans found in user data.");
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("[ERROR] Error fetching full user data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading exercise items...</p>;
  }

  // If no dayPlans, show a message
  if (dayPlans.length === 0) {
    return <p>No exercises found in your workout plan.</p>;
  }

  return (
    <div className={styles.exerciseCarousel}>
      <Carousel nextLabel="Next" prevLabel="Previous" indicators={false} interval={null}>
        {/* Map each "dayPlan" to its own Carousel slide */}
        {dayPlans.map((day, dayIndex) => (
          <Carousel.Item key={dayIndex}>
            <div className={styles.carouselItemContent}>
              <h2>Day {day.dayNumber}</h2>

              {/* For each day, map over the "exercises" array */}
              {day.exercises && day.exercises.length > 0 ? (
                day.exercises.map((exercise, exIndex) => (
                  <div key={exIndex} className={styles.exerciseBlock}>
                    <h3 className={styles.exerciseName}>{exercise.name}</h3>
                    <p className={styles.muscleGroup}>
                      <strong>Muscle Group:</strong> {exercise.muscleGroup}
                    </p>
                    {exercise.gifUrl && (
                      <img
                        src={exercise.gifUrl}
                        alt={exercise.name}
                        className={styles.exerciseGif}
                      />
                    )}
                    <p className={styles.description}>
                      <strong>Description:</strong> {exercise.description}
                    </p>
                    <p className={styles.equipment}>
                      <strong>Equipment:</strong> {exercise.equipment}
                    </p>
                  </div>
                ))
              ) : (
                <p>No exercises for this day.</p>
              )}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default ExerciseCarousel;
