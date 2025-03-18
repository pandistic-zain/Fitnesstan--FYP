import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { getFullUserData } from "../../API/RegisterAPI";
import styles from "./ExerciseCarousel.module.css";

const ExerciseCarousel = () => {
  const [dayPlans, setDayPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.debug("[DEBUG] Fetching full user data from /user/full...");
    getFullUserData()
      .then((dto) => {
        // The DTO is { user, diet, workoutPlan }
        console.debug("[DEBUG] FullUserInfoDTO:", JSON.stringify(dto, null, 2));
        console.debug("[DEBUG] startting entering data:");

        const workoutPlan = dto.workoutPlan;
        if (workoutPlan && workoutPlan.dayPlans) {
          setDayPlans(workoutPlan.dayPlans);
        } else {
          console.warn("[WARN] No workoutPlan or dayPlans found in user data.");
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

  if (dayPlans.length === 0) {
    return <p>No day plans found.</p>;
  }

  // We'll do a day-by-day carousel. Each day is a "slide."
  return (
    <Carousel
      interval={null}
      nextLabel="Next Day"
      prevLabel="Previous Day"
      indicators={false}
    >
      {dayPlans.map((day, dayIndex) => (
        <Carousel.Item key={dayIndex}>
          <div className={styles.carouselItemContent}>
            <h2>Day {day.dayNumber}</h2>
            {(!day.exercises || day.exercises.length === 0) ? (
              <p>No exercises for this day.</p>
            ) : (
              day.exercises.map((exercise, exIndex) => (
                <div key={exIndex} style={{ marginBottom: "1rem" }}>
                  <h3>{exercise.name}</h3>
                  <p><strong>Muscle Group:</strong> {exercise.muscleGroup}</p>
                  {exercise.gifUrl && (
                    <img
                      src={exercise.gifUrl}
                      alt={exercise.name}
                      className={styles.exerciseGif}
                    />
                  )}
                  <p><strong>Description:</strong> {exercise.description}</p>
                  <p><strong>Equipment:</strong> {exercise.equipment}</p>
                </div>
              ))
            )}
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ExerciseCarousel;
