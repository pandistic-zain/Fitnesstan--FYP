// src/components/ExerciseCarousel.jsx
import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { getFullUserData } from "../../API/RegisterAPI";
import styles from "./ExerciseCarousel.module.css";

const ExerciseCarousel = () => {
  const [exercises, setExercises] = useState([]);
  const [currentDay, setCurrentDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    console.debug("[DEBUG] Fetching full user data from /user/full...");
    getFullUserData()
      .then((dto) => {
        // The DTO is { user, diet, workoutPlan }
        console.debug("[DEBUG] FullUserInfoDTO:", JSON.stringify(dto, null, 2));

        const workoutPlan = dto.workoutPlan;
        if (workoutPlan && workoutPlan.dayPlans && workoutPlan.startDate) {
          // Calculate the current day based on the plan's start date.
          const planStart = new Date(workoutPlan.startDate);
          const today = new Date();
          const diffInMs = today - planStart;
          let calculatedDay = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;

          // Clamp currentDay between 1 and the total number of dayPlans
          if (calculatedDay < 1) calculatedDay = 1;
          if (calculatedDay > workoutPlan.dayPlans.length) {
            calculatedDay = workoutPlan.dayPlans.length;
          }

          console.debug("[DEBUG] Calculated current day:", calculatedDay);
          setCurrentDay(calculatedDay);

          // Retrieve the exercises for the current day (zero-indexed)
          const currentDayPlan = workoutPlan.dayPlans[calculatedDay - 1];
          if (currentDayPlan && currentDayPlan.exercises) {
            setExercises(currentDayPlan.exercises);
          } else {
            console.warn("[WARN] No exercises found for current day.");
          }
        } else {
          console.warn("[WARN] Workout plan or start date is missing in user data.");
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

  if (exercises.length === 0) {
    return <p>No exercises found for today.</p>;
  }

  return (
    <div className={styles.exerciseCarouselContainer}>
      {/* Display the current day above the carousel */}
      <h2 className={styles.dayHeading}>Day {currentDay}</h2>
      <Carousel
        interval={null}
        activeIndex={activeIndex}
        onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
        nextLabel="Next Exercise"
        prevLabel="Previous Exercise"
        indicators={false}
      >
        {exercises.map((exercise, index) => (
          <Carousel.Item key={index}>
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
