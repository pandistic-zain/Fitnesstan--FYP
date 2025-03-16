// src/components/DietCarousel.jsx
import React from "react";
import Carousel from "react-bootstrap/Carousel";
// Import your CSS module
import styles from "./DietCarousel.module.css";

const DietCarousel = ({ dietDays }) => {
  // Example shape of dietDays:
  // [
  //   {
  //     day: "Day 1",
  //     meal1: [
  //       { name: "Grilled Chicken", carbs: 0, fats: 5, calories: 200, weight: 100 },
  //       { name: "Salad", carbs: 5, fats: 0, calories: 50, weight: 80 },
  //     ],
  //     meal2: [
  //       { name: "Brown Rice", carbs: 35, fats: 1, calories: 150, weight: 120 },
  //     ]
  //   },
  //   {
  //     day: "Day 2",
  //     meal1: [...],
  //     meal2: [...]
  //   }
  // ]

  return (
    <div className={styles.dietCarousel}>
      <Carousel
        nextLabel="Next"
        prevLabel="Previous"
        indicators={false}
        interval={null}  // No auto-sliding
      >
        {dietDays.map((dayInfo, index) => (
          <Carousel.Item key={index}>
            <div className={styles.carouselDayContent}>
              <h2>{dayInfo.day}</h2>

              {/* Meal 1 */}
              <div className={styles.mealSection}>
                <h4>Meal 1</h4>
                {dayInfo.meal1 && dayInfo.meal1.length > 0 ? (
                  <table className={styles.mealTable}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Carbs (g)</th>
                        <th>Fats (g)</th>
                        <th>Calories</th>
                        <th>Weight (g)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dayInfo.meal1.map((item, i) => (
                        <tr key={i}>
                          <td>{item.name}</td>
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

              {/* Meal 2 */}
              <div className={styles.mealSection}>
                <h4>Meal 2</h4>
                {dayInfo.meal2 && dayInfo.meal2.length > 0 ? (
                  <table className={styles.mealTable}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Carbs (g)</th>
                        <th>Fats (g)</th>
                        <th>Calories</th>
                        <th>Weight (g)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dayInfo.meal2.map((item, i) => (
                        <tr key={i}>
                          <td>{item.name}</td>
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
        ))}
      </Carousel>
    </div>
  );
};

export default DietCarousel;
