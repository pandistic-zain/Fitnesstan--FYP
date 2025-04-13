// src/components/DietCarousel.jsx
import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { getFullUserData } from "../../API/RegisterAPI"; // Adjust import path as needed
import { useNavigate } from "react-router-dom";
import styles from "./DietCarousel.module.css"; // Import your CSS module
import Loader from "../Loader";

function DietCarousel() {
  // State for the current day's meal data and computed day number.
  const [currentDayData, setCurrentDayData] = useState(null);
  const [dayNumber, setDayNumber] = useState(null);
  const [loading, setLoading] = useState(true);

  // For this dashboard version, Meal 2 is locked – user must click a button to view the full diet plan.
  const navigate = useNavigate();

  // First fetch: determine the current day number from workoutPlan.startDate.
  useEffect(() => {
    getFullUserData()
      .then((dto) => {
        if (!dto || !dto.diet || !dto.diet.mealPlan || !dto.workoutPlan) {
          console.warn(
            "[WARN] No diet or mealPlan/workoutPlan found in user data."
          );
          setLoading(false);
          return;
        }
        const planStart = dto.workoutPlan.startDate;
        let computedDay = 1;
        if (planStart) {
          const startDate = new Date(planStart);
          const now = new Date();
          computedDay = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;
        }
        const dayKeys = Object.keys(dto.diet.mealPlan).map((k) =>
          parseInt(k, 10)
        );
        const maxDay = Math.max(...dayKeys);
        if (computedDay < 1) computedDay = 1;
        if (computedDay > maxDay) computedDay = maxDay;
        setDayNumber(computedDay);
        setLoading(false);
      })
      .catch((err) => {
        console.error("[ERROR] Fetching user data failed:", err);
        setLoading(false);
      });
  }, []);

  // Second fetch: once dayNumber is known, fetch the meal data for that day.
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

  // Handler for forcing unlock of Meal 2.
  // This navigates the user to the full diet plan page.
  const handleForceUnlockMeal2 = () => {
    navigate("/DietPage");
  };

  if (loading) {
    return <p className={styles.statusMessage}>Loading diet plan... 😊</p>;
  }

  if (!dayNumber) {
    return (
      <p className={styles.statusMessage}>
        No day found for diet plan. 😕
      </p>
    );
  }

  if (!currentDayData) {
    return (
      <div className={styles.dietCarousel}>
        <h2>Day {dayNumber}</h2>
        <p className={styles.statusMessage}>
          No meal data found for this day. 😕
        </p>
      </div>
    );
  }

  // Extract meal arrays for Meal 1 and Meal 2.
  const meal1 = currentDayData.meal1 || [];
  const meal2 = currentDayData.meal2 || [];

  return (
    <div className={styles.dietCarousel}>
      <Carousel
        nextLabel="Next"
        prevLabel="Previous"
        indicators={false}
        interval={2000}
        wrap={true}
      >
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
                // For the current day, lock Meal 2.
                // (For past days, you might display it normally.)
                <div className={styles.mealLocked}>
                  {/* Blur overlay with red tint */}
                  <div className={styles.blurOverlay}></div>
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
                  <button
                    className={styles.forceUnlockButton}
                    onClick={handleForceUnlockMeal2}
                  >
                    View Full Diet Plan
                  </button>
                </div>
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
