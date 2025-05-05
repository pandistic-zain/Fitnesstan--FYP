// src/components/DietPage.jsx
import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { getFullUserData } from "../../API/RegisterAPI";
import { useNavigate } from "react-router-dom";
import Footer from "../../Components/Footer";
import { MdDashboard } from "react-icons/md";
import { FaAppleAlt, FaDumbbell, FaKey } from "react-icons/fa";
import styles from "./DietPage.module.css";
import logo from "../../Assets/FITNESSTAN BARA LOGO_inverted.png";
import Loader from "../Loader";

const DietPage = () => {
  const [dayPlans, setDayPlans] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDayNumber, setCurrentDayNumber] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // States for intermittent fasting functionality (only for current day)
  const [meal1Completed, setMeal1Completed] = useState(false);
  const [meal1CompletionTime, setMeal1CompletionTime] = useState(null);
  const [meal2RemainingTime, setMeal2RemainingTime] = useState(0);
  const [forcedMeal2Unlocked, setForcedMeal2Unlocked] = useState(false);

  const navigate = useNavigate();

  // First fetch: determine current day number from workoutPlan.startDate.
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
          computedDay =
            Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;
        }
        const dayKeys = Object.keys(dto.diet.mealPlan).map((k) =>
          parseInt(k, 10)
        );
        const maxDay = Math.max(...dayKeys);
        if (computedDay < 1) computedDay = 1;
        if (computedDay > maxDay) computedDay = maxDay;
        setCurrentDayNumber(computedDay);
        setLoading(false);
      })
      .catch((err) => {
        console.error("[ERROR] Fetching user data failed:", err);
        setLoading(false);
      });
  }, []);

  // Second fetch: once currentDayNumber is known, fetch the meal data for that day.
  useEffect(() => {
    if (!currentDayNumber) return;
    setLoading(true);
    getFullUserData()
      .then((dto) => {
        if (!dto || !dto.diet || !dto.diet.mealPlan) {
          setLoading(false);
          return;
        }
        const dayKeys = Object.keys(dto.diet.mealPlan).map(Number);
        const allDays = dayKeys
          .sort((a, b) => a - b)
          .map((dayNum) => ({
            dayNumber: dayNum,
            ...dto.diet.mealPlan[String(dayNum)],
          }));
        setDayPlans(allDays);
        // By default, set selectedDay to the current day (if available)
        const currentDayPlan = allDays.find(
          (day) => day.dayNumber === currentDayNumber
        );
        setSelectedDay(currentDayPlan);
        setLoading(false);
      })
      .catch((err) => {
        console.error("[ERROR] Re-fetching user data failed:", err);
        setLoading(false);
      });
  }, [currentDayNumber]);

  // Timer effect for Meal 2 unlocking (only for the current day)
  useEffect(() => {
    let timer = null;
    if (
      selectedDay &&
      currentDayNumber &&
      selectedDay.dayNumber === currentDayNumber &&
      meal1Completed &&
      meal1CompletionTime &&
      !forcedMeal2Unlocked
    ) {
      timer = setInterval(() => {
        const elapsed = Date.now() - meal1CompletionTime;
        const eightHours = 8 * 60 * 60 * 1000;
        const remaining = eightHours - elapsed;
        setMeal2RemainingTime(remaining > 0 ? remaining : 0);
        if (remaining <= 0) clearInterval(timer);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [
    selectedDay,
    currentDayNumber,
    meal1Completed,
    meal1CompletionTime,
    forcedMeal2Unlocked,
  ]);

  // Hide sidebar on scroll
  useEffect(() => {
    const handleScroll = () => setSidebarVisible(false);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const signOut = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    navigate("/", { replace: true });
  };

  // Handler for marking Meal 1 as completed.
  const handleMeal1Done = () => {
    setMeal1Completed(true);
    setMeal1CompletionTime(Date.now());
  };

  // Handler to force unlock Meal 2.
  const handleForceUnlockMeal2 = () => {
    setForcedMeal2Unlocked(true);
    setMeal2RemainingTime(0);
    setTimeout(() => {
      setForcedMeal2Unlocked(false);
    }, 10000);
  };

  // Function to handle changing a specific meal item (name).
  const handleItemChange = (mealNumber, itemIndex) => {
    const newItemName = prompt("Enter the new food item name:");
    if (!newItemName) return; // If no name is entered, do nothing.

    // Updating the item in the selected day's meal.
    const updatedMeals = { ...selectedDay };
    const updatedMeal = updatedMeals[`meal${mealNumber}`];
    updatedMeal[itemIndex].name = newItemName; // Change the food item name.

    // Update state with new data
    setSelectedDay(updatedMeals);
  };

  // Helper: format milliseconds as hh:mm:ss.
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (loading) {
    return <Loader />;
  }

  if (!dayPlans.length) {
    return <p className={styles.statusMessage}>No diet plan data found.</p>;
  }

  return (
    <div className={styles.dietPageWrapper}>
      {/* NAVBAR */}
      <nav className={`navbar navbar-expand-lg ${styles.navbarCustom}`}>
        <div className={styles.customToggleContainer}>
          <input
            id="checkbox2"
            type="checkbox"
            checked={sidebarVisible}
            onChange={() => setSidebarVisible(!sidebarVisible)}
            className={styles.checkbox2}
          />
          <label className={styles.toggle2} htmlFor="checkbox2">
            <div className={`${styles.bars} ${styles.bar4}`}></div>
            <div className={`${styles.bars} ${styles.bar5}`}></div>
            <div className={`${styles.bars} ${styles.bar6}`}></div>
          </label>
        </div>
        <div className={styles.navbarLogoWrapper}>
          <img src={logo} alt="Fitnesstan Logo" style={{ height: "50px" }} />
        </div>
      </nav>

      {/* LAYOUT: SIDEBAR + MAIN CONTENT */}
      <div className={styles.layoutContainer}>
        {/* SIDEBAR */}
        <div
          className={
            sidebarVisible
              ? styles.sidebarContainer
              : `${styles.sidebarContainer} ${styles.sidebarHidden}`
          }
        >
          <ul className={styles.sidebarList}>
            <li className={styles.sidebarItem}>
              <a href="/userdashboard">
                <MdDashboard className={styles.icon} /> Dashboard
              </a>
            </li>
            <li className={styles.sidebarItem}>
              <a href="/DietPage">
                <FaAppleAlt className={styles.icon} /> Diet Plan
              </a>
            </li>
            <li className={styles.sidebarItem}>
              <a href="/ExercisePage">
                <FaDumbbell className={styles.icon} /> Exercise
              </a>
            </li>
            <li className={styles.sidebarItem}>
              <a href="/settings">
                <FaKey className={styles.icon} /> Change Password
              </a>
            </li>
          </ul>
          <button className={styles.button} onClick={signOut}>
            SIGN OUT
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Diet Plan</h1>

          {/* Day Toggle: Only allow selection of past and current days */}
          <div className={styles.dayToggle}>
            {dayPlans.map((day) => (
              <button
                key={day.dayNumber}
                className={`${styles.toggleButton} ${
                  selectedDay && selectedDay.dayNumber === day.dayNumber
                    ? styles.active
                    : ""
                } ${
                  day.dayNumber > currentDayNumber ? styles.lockedToggle : ""
                }`}
                onClick={() => {
                  if (day.dayNumber <= currentDayNumber) {
                    setSelectedDay(day);
                  } else {
                    alert("This day is locked until it becomes current.");
                  }
                }}
                disabled={day.dayNumber > currentDayNumber}
              >
                Day {day.dayNumber}
                {day.dayNumber > currentDayNumber && " 🔒"}
              </button>
            ))}
          </div>

          {/* Selected Day Content */}
          {selectedDay ? (
            <div className={styles.dayContent}>
              <h2 className={styles.dayHeading}>Day {selectedDay.dayNumber}</h2>
              {/* Show locked view for future days */}
              {selectedDay.dayNumber > currentDayNumber ? (
                <p className={styles.statusMessage}>
                  Future day's diet is locked until it becomes current.
                </p>
              ) : (
                <Carousel
                  nextLabel="Next"
                  prevLabel="Previous"
                  indicators={false}
                  interval={3000}
                >
                  {/* Slide for Meal 1 */}
                  <Carousel.Item>
                    <div className={styles.carouselDayContent}>
                      <h3 className={styles.mealHeading}>Meal 1</h3>
                      {selectedDay.meal1 && selectedDay.meal1.length > 0 ? (
                        <>
                          <table className={styles.mealTable}>
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Protein (g)</th>
                                <th>Carbs (g)</th>
                                <th>Fats (g)</th>
                                <th>Calories</th>
                                <th>Weight (g)</th>
                                <th>Change</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedDay.meal1.map((item, i) => (
                                <tr key={i}>
                                  <td>{item.name}</td>
                                  <td>{item.protein}</td>
                                  <td>{item.carbs}</td>
                                  <td>{item.fats}</td>
                                  <td>{item.calories}</td>
                                  <td>{item.weight}</td>
                                  <td>
                                    <button
                                      className={styles.changeButton}
                                      onClick={() => handleItemChange(1, i)}
                                    >
                                      Change
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className={styles.mealCompletion}>
                            {!meal1Completed ? (
                              <button
                                className={styles.markDoneButton}
                                onClick={handleMeal1Done}
                              >
                                Mark Meal 1 as Done
                              </button>
                            ) : (
                              <div className={styles.mealCompleted}>
                                <span>Meal 1 Completed</span>
                                <span className={styles.completedIcon}>✔</span>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <p>No items in Meal 1.</p>
                      )}
                    </div>
                  </Carousel.Item>

                  {/* Slide for Meal 2 */}
                  <Carousel.Item>
                    <div className={styles.carouselDayContent}>
                      <h3 className={styles.mealHeading}>Meal 2</h3>
                      {selectedDay.meal2 && selectedDay.meal2.length > 0 ? (
                        selectedDay.dayNumber === currentDayNumber &&
                        (!meal1Completed ||
                          (meal2RemainingTime > 0 && !forcedMeal2Unlocked)) ? (
                          <div className={styles.mealLocked}>
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
                                  <th>Change</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedDay.meal2.map((item, i) => (
                                  <tr key={i}>
                                    <td>{item.name}</td>
                                    <td>{item.protein}</td>
                                    <td>{item.carbs}</td>
                                    <td>{item.fats}</td>
                                    <td>{item.calories}</td>
                                    <td>{item.weight}</td>
                                    <td>
                                      <button
                                        className={styles.changeButton}
                                        onClick={() => handleItemChange(2, i)}
                                      >
                                        Change
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div className={styles.timerMessage}>
                              {!meal1Completed ? (
                                <span>Complete Meal 1 to unlock Meal 2 😇</span>
                              ) : (
                                <span>
                                  Meal 2 available in:{" "}
                                  {formatTime(meal2RemainingTime)} ⏳
                                </span>
                              )}
                            </div>
                            <button
                              className={styles.forceUnlockButton}
                              onClick={handleForceUnlockMeal2}
                            >
                              View Full Diet Plan
                            </button>
                          </div>
                        ) : (
                          <table className={styles.mealTable}>
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Protein (g)</th>
                                <th>Carbs (g)</th>
                                <th>Fats (g)</th>
                                <th>Calories</th>
                                <th>Weight (g)</th>
                                <th>Change</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedDay.meal2.map((item, i) => (
                                <tr key={i}>
                                  <td>{item.name}</td>
                                  <td>{item.protein}</td>
                                  <td>{item.carbs}</td>
                                  <td>{item.fats}</td>
                                  <td>{item.calories}</td>
                                  <td>{item.weight}</td>
                                  <td>
                                    <button
                                      className={styles.changeButton}
                                      onClick={() => handleItemChange(2, i)}
                                    >
                                      Change
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )
                      ) : (
                        <p>No items in Meal 2.</p>
                      )}
                    </div>
                  </Carousel.Item>
                </Carousel>
              )}
            </div>
          ) : (
            <p className={styles.statusMessage}>Please select a day.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DietPage;
