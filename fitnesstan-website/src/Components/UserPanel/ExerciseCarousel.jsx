// src/components/ExerciseCarousel.jsx
import React, { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import axios from "axios";
import styles from "./ExerciseCarousel.module.css";

const ExerciseCarousel = () => {
  const [exerciseItems, setExerciseItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch exercise items from your backend
    axios
      .get("http://localhost:8080/user/exerciseItems")
      .then((response) => {
        setExerciseItems(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching exercise items:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading exercise items...</p>;
  }

  return (
    <div className={styles.exerciseCarousel}>
      <Carousel
        nextLabel="Next"
        prevLabel="Previous"
        indicators={false}
        interval={null} // No auto-slide
      >
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
    </div>
  );
};

export default ExerciseCarousel;
