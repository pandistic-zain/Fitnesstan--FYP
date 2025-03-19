// src/components/ExerciseCarousel.jsx
import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { getFullUserData, buildImageUrl } from "../../API/RegisterAPI";
import styles from "./ExerciseCarousel.module.css";

function extractFilename(fullPath = "") {
  // Replace backslashes with forward slashes to unify
  const sanitized = fullPath.replace(/\\/g, "/");
  // Split by "/"
  const parts = sanitized.split("/");
  return parts[parts.length - 1]; // last chunk
}

const ExerciseCarousel = () => {
  const [currentDayPlan, setCurrentDayPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.debug("[DEBUG] Fetching full user data from /user/full...");
    getFullUserData()
      .then((dto) => {
        // The DTO is { user, diet, workoutPlan }
        console.debug("[DEBUG] FullUserInfoDTO:", JSON.stringify(dto, null, 2));

        const workoutPlan = dto.workoutPlan;
        if (!workoutPlan || !workoutPlan.dayPlans) {
          console.warn("[WARN] No workoutPlan or dayPlans found in user data.");
          setLoading(false);
          return;
        }

        // 1) Parse the start date from the workout plan
        const startDate = new Date(workoutPlan.startDate); 
        const now = new Date();

        // 2) Calculate how many days have passed since startDate
        // Add +1 so that startDate is considered "Day 1"
        const dayDiff = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;

        // 3) Clamp dayDiff to the range [1, lengthOfPlan]
        const maxDayNumber = workoutPlan.dayPlans.length;
        let currentDayNumber = dayDiff;
        if (currentDayNumber < 1) currentDayNumber = 1;
        if (currentDayNumber > maxDayNumber) currentDayNumber = maxDayNumber;

        // 4) Find the dayPlan whose dayNumber matches currentDayNumber
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

        // 5) Transform each exercise’s gifUrl to a publicly served URL
        const updatedExercises = (dayPlan.exercises || []).map((exercise) => {
          if (exercise.gifUrl) {
            const fileName = extractFilename(exercise.gifUrl);
            const publicUrl = buildImageUrl(fileName); 
            return { ...exercise, gifUrl: publicUrl };
          }
          return exercise;
        });

        // 6) Store the single day’s plan in state
        setCurrentDayPlan({
          ...dayPlan,
          exercises: updatedExercises,
        });

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

  // If no exercises for this day
  if (!currentDayPlan.exercises || currentDayPlan.exercises.length === 0) {
    return (
      <div className={styles.exerciseCarousel}>
        <h2>Day {currentDayPlan.dayNumber}</h2>
        <p>No exercises for this day.</p>
      </div>
    );
  }

  // Render the single day's exercises in a carousel
  return (
    <div className={styles.exerciseCarousel}>
      <h2>Day {currentDayPlan.dayNumber}</h2>
      <Carousel
        interval={null}
        nextLabel="Next Exercise"
        prevLabel="Previous Exercise"
        indicators={false}
      >
        {currentDayPlan.exercises.map((exercise, exIndex) => (
          <Carousel.Item key={exIndex}>
            <div className={styles.carouselItemContent}>
              <h3>{exercise.name}</h3>
              <p>
                <strong>Muscle Group:</strong> {exercise.muscleGroup}
              </p>
              {exercise.gifUrl && (
                <img
                  src={exercise.gifUrl}
                  alt={exercise.name}
                  className={styles.exerciseGif}
                />
              )}
              <p>
                <strong>Description:</strong> {exercise.description}
              </p>
              <p>
                <strong>Equipment:</strong> {exercise.equipment}
              </p>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default ExerciseCarousel;
