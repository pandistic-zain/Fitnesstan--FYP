// src/components/DietCarousel.jsx
import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { getFullUserData } from "../../API/RegisterAPI"; // Adjust import path as needed
import styles from "./DietCarousel.module.css"; // Import CSS module or regular CSS

function DietCarousel() {
  const [currentDayData, setCurrentDayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dayNumber, setDayNumber] = useState(null);

  useEffect(() => {
    // First fetch user data to determine the current day number.
    getFullUserData()
      .then((dto) => {
        if (!dto || !dto.diet || !dto.diet.mealPlan) {
          console.warn("[WARN] No diet or mealPlan found in user data.");
          setLoading(false);
          return;
        }

        // Determine the current day number from workoutPlan.startDate.
        const planStart = dto.workoutPlan?.startDate || null;
        if (!planStart) {
          console.warn("[WARN] No startDate found; defaulting to day 1.");
          setDayNumber(1);
        } else {
          const startDate = new Date(planStart);
          const now = new Date();
          const dayDiff =
            Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;
          const dayKeys = Object.keys(dto.diet.mealPlan).map((k) =>
            parseInt(k, 10)
          );
          const maxDay = Math.max(...dayKeys);
          const actualDay = Math.max(1, Math.min(dayDiff, maxDay));
          setDayNumber(actualDay);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("[ERROR] Fetching user data failed:", err);
        setLoading(false);
      });
  }, []);

  // Once we have the day number, fetch the meal data for that day.
  useEffect(() => {
    if (!dayNumber) return;
    setLoading(true);
    getFullUserData()
      .then((dto) => {
        if (!dto || !dto.diet || !dto.diet.mealPlan) {
          setLoading(false);
          return;
        }
        const dayStr = String(dayNumber); // mealPlan keys are strings
        const dayData = dto.diet.mealPlan[dayStr];
        setCurrentDayData(dayData || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("[ERROR] Re-fetching user data failed:", err);
        setLoading(false);
      });
  }, [dayNumber]);

  if (loading) {
    return <p>Loading diet plan...</p>;
  }

  if (!dayNumber) {
    return <p>No day found for diet plan.</p>;
  }

  if (!currentDayData) {
    return (
      <div className={styles.dietCarousel}>
        <h2>Day {dayNumber}</h2>
        <p>No meal data found for this day.</p>
      </div>
    );
  }

  // Extract meal arrays for Meal 1 and Meal 2
  const meal1 = currentDayData.meal1 || [];
  const meal2 = currentDayData.meal2 || [];

  return (
    <div className={styles.dietCarousel}>
      <Carousel nextLabel="Next" prevLabel="Previous" indicators={false} interval={2000} wrap={true}>
        {/* Slide for Meal 1 */}
        <Carousel.Item>
          <div className={styles.carouselDayContent}>
            <h2>Day {dayNumber}</h2>
            <div className={styles.mealSection}>
              <h4>Meal 1</h4>
              {meal1.length > 0 ? (
                <table className={styles.mealTable}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Protein (g)</th>
                      <th>Carbs (g)</th>
                      <th>Fats (g)</th>
                      <th>Calories</th>
                      <th>Weight (g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meal1.map((item, i) => (
                      <tr key={i}>
                        <td>{item.name}</td>
                        <td>{item.protein}</td>
                        <td>{item.carbs}</td>
                        <td>{item.fats}</td>
                        <td>{item.calories}</td>
                        <td>{item.weight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No items in Meal 1.</p>
              )}
            </div>
          </div>
        </Carousel.Item>

        {/* Slide for Meal 2 */}
        <Carousel.Item>
          <div className={styles.carouselDayContent}>
            <h2>Day {dayNumber}</h2>
            <div className={styles.mealSection}>
              <h4>Meal 2</h4>
              {meal2.length > 0 ? (
                <table className={styles.mealTable}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Protein (g)</th>
                      <th>Carbs (g)</th>
                      <th>Fats (g)</th>
                      <th>Calories</th>
                      <th>Weight (g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meal2.map((item, i) => (
                      <tr key={i}>
                        <td>{item.name}</td>
                        <td>{item.protein}</td>
                        <td>{item.carbs}</td>
                        <td>{item.fats}</td>
                        <td>{item.calories}</td>
                        <td>{item.weight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No items in Meal 2.</p>
              )}
            </div>
          </div>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default DietCarousel;
