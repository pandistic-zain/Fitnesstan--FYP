// src/components/ExerciseCarousel.jsx
import React, { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import { getFullUserData } from "../../API/RegisterAPI";
import styles from "./ExerciseCarousel.module.css";

const ExerciseCarousel = () => {
  const [exerciseItems, setExerciseItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.debug("[DEBUG] Fetching full user data from /user/full...");
    getFullUserData()
      .then((response) => {
        // Log the raw response for inspection.
        console.debug(
          "[DEBUG] Raw full user data:",
          JSON.stringify(response.data, null, 2)
        );

        // Access the workoutPlan property (as set by the DTO)
        const workoutPlan = response.data?.workoutPlan;
        if (workoutPlan && workoutPlan.dayPlans) {
          console.debug(
            "[DEBUG] Workout plan found with",
            workoutPlan.dayPlans.length,
            "day plans"
          );

          // Flatten all exercises from each day into a single array.
          const allExercises = workoutPlan.dayPlans.reduce((acc, day) => {
            const exerciseCount = day.exercises ? day.exercises.length : 0;
            console.debug(
              `[DEBUG] Processing Day ${day.dayNumber} with ${exerciseCount} exercises`
            );
            return acc.concat(day.exercises || []);
          }, []);

          console.debug("[DEBUG] Total exercises fetched:", allExercises.length);
          setExerciseItems(allExercises);
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

  return (
    <div className={styles.exerciseCarousel}>
      {exerciseItems.length === 0 ? (
        <p>No exercises found in your workout plan.</p>
      ) : (
        <Carousel nextLabel="Next" prevLabel="Previous" indicators={false} interval={null}>
          {exerciseItems.map((item, index) => (
            <Carousel.Item key={index}>
              <div className={styles.carouselItemContent}>
                <h3 className={styles.exerciseName}>{item.name}</h3>
                <p className={styles.muscleGroup}>
                  <strong>Muscle Group:</strong> {item.muscleGroup}
                </p>
                {item.gifUrl && (
                  <img
                    src={item.gifUrl}
                    alt={item.name}
                    className={styles.exerciseGif}
                  />
                )}
                <p className={styles.description}>
                  <strong>Description:</strong> {item.description}
                </p>
                <p className={styles.equipment}>
                  <strong>Equipment:</strong> {item.equipment}
                </p>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default ExerciseCarousel;
