// src/components/ExerciseCarousel.jsx
import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { getFullUserData, buildImageUrl } from "../../API/RegisterAPI";
import styles from "./ExerciseCarousel.module.css";

// Helper function: Extract file name from a full path.
function extractFilename(fullPath = "") {
  // Replace backslashes with forward slashes
  const sanitized = fullPath.replace(/\\/g, "/");
  // Return the last chunk after splitting by "/"
  return sanitized.split("/").pop();
}

const ExerciseCarousel = () => {
  const [currentDayPlan, setCurrentDayPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.debug("[DEBUG] Fetching full user data from /user/full...");
    getFullUserData()
      .then((dto) => {
        console.debug("[DEBUG] FullUserInfoDTO:", JSON.stringify(dto, null, 2));
        const workoutPlan = dto.workoutPlan;
        if (!workoutPlan || !workoutPlan.dayPlans) {
          console.warn("[WARN] No workoutPlan or dayPlans found in user data.");
          setLoading(false);
          return;
        }

        // Calculate the current day number from the workout plan's startDate.
        const startDate = new Date(workoutPlan.startDate);
        const now = new Date();
        const dayDiff =
          Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;
        const maxDayNumber = workoutPlan.dayPlans.length;
        let currentDayNumber = dayDiff;
        if (currentDayNumber < 1) currentDayNumber = 1;
        if (currentDayNumber > maxDayNumber) currentDayNumber = maxDayNumber;

        // Find the dayPlan for the current day.
        const dayPlan = workoutPlan.dayPlans.find(
          (day) => day.dayNumber === currentDayNumber
        );
        if (!dayPlan) {
          console.warn(
            `[WARN] dayNumber=${currentDayNumber} not found in dayPlans.`
          );
          setLoading(false);
          return;
        }

        // Update each exercise's gifUrl from a full local path to a public URL.
        const updatedExercises = (dayPlan.exercises || []).map((exercise) => {
          if (exercise.gifUrl) {
            const fileName = extractFilename(exercise.gifUrl);
            const publicUrl = buildImageUrl(fileName);
            return { ...exercise, gifUrl: publicUrl };
          }
          return exercise;
        });

        // Store the current day plan with updated exercises in state.
        setCurrentDayPlan({ ...dayPlan, exercises: updatedExercises });
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

  if (!currentDayPlan) {
    return <p>No current day plan found.</p>;
  }

  if (!currentDayPlan.exercises || currentDayPlan.exercises.length === 0) {
    return (
      <div className={styles.exerciseCarousel}>
        <h2>Day {currentDayPlan.dayNumber}</h2>
        <p>No exercises for this day.</p>
      </div>
    );
  }

  return (
    <div className={styles.exerciseCarousel}>
      <h2>Day {currentDayPlan.dayNumber}</h2>
      <Carousel
        interval={3000}  // Auto-slide every 3 seconds (3000 ms)
        nextLabel="Next Exercise"
        prevLabel="Previous Exercise"
        indicators={false}
      >
        {currentDayPlan.exercises.map((exercise, exIndex) => (
          <Carousel.Item key={exIndex}>
            <div className={styles.carouselItemContent}>
              <h1 className={styles.exerciseName}>{exercise.name}</h1>
              <h3 className={styles.muscleGroup}>{exercise.muscleGroup}</h3>
              {exercise.gifUrl && (
                <div className={styles.exerciseGifContainer}>
                  <img
                    src={exercise.gifUrl}
                    alt={exercise.name}
                    className={styles.exerciseGif}
                  />
                </div>
              )}
              <p className={styles.description}>{exercise.description}</p>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default ExerciseCarousel;
