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
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();

  // Fetch full user data to extract diet plan and compute current day
  useEffect(() => {
    getFullUserData()
      .then((dto) => {
        if (!dto || !dto.diet || !dto.diet.mealPlan) {
          console.warn("[WARN] No diet or mealPlan found in user data.");
          setLoading(false);
          return;
        }

        // Determine current day from workoutPlan.startDate
        const planStart = dto.workoutPlan?.startDate;
        let currentDayNumber = 1;
        if (planStart) {
          const startDate = new Date(planStart);
          const now = new Date();
          currentDayNumber =
            Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;
        }
        // MealPlan keys are strings (e.g., "1", "2", …)
        const dayKeys = Object.keys(dto.diet.mealPlan).map(Number);
        const maxDay = Math.max(...dayKeys);
        if (currentDayNumber < 1) currentDayNumber = 1;
        if (currentDayNumber > maxDay) currentDayNumber = maxDay;

        // Build an array of all day plans for toggling
        const allDays = dayKeys
          .sort((a, b) => a - b)
          .map((dayNum) => ({
            dayNumber: dayNum,
            ...dto.diet.mealPlan[String(dayNum)]
          }));
        setDayPlans(allDays);

        // Default to current day plan
        const currentDayPlan = allDays.find(
          (day) => day.dayNumber === currentDayNumber
        );
        setSelectedDay(currentDayPlan);
        setLoading(false);
      })
      .catch((error) => {
        console.error("[ERROR] Error fetching full user data:", error);
        setLoading(false);
      });
  }, []);

  // Hide sidebar on scroll
  useEffect(() => {
    const handleScroll = () => setSidebarVisible(false);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sign out function: clear storage and navigate to home, replacing history.
  const signOut = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    navigate("/", { replace: true });
  };

  if (loading) {
    return <Loader/>
  }

  if (!dayPlans.length) {
    return <p>No diet plan data found.</p>;
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
                <MdDashboard className={styles.icon} />
                Dashboard
              </a>
            </li>
            <li className={styles.sidebarItem}>
              <a href="/DietPage">
                <FaAppleAlt className={styles.icon} />
                Diet Plan
              </a>
            </li>
            <li className={styles.sidebarItem}>
              <a href="/ExercisePage">
                <FaDumbbell className={styles.icon} />
                Exercise
              </a>
            </li>
            <li className={styles.sidebarItem}>
              <a href="/settings">
                <FaKey className={styles.icon} />
                Change Password
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

          {/* Day Toggle: full-width toggle buttons */}
          <div className={styles.dayToggle}>
            {dayPlans.map((day) => (
              <button
                key={day.dayNumber}
                className={`${styles.toggleButton} ${
                  selectedDay?.dayNumber === day.dayNumber ? styles.active : ""
                }`}
                onClick={() => setSelectedDay(day)}
              >
                Day {day.dayNumber}
              </button>
            ))}
          </div>

          {/* Selected Day Content */}
          {selectedDay ? (
            <div className={styles.dayContent}>
              <h2 className={styles.dayHeading}>Day {selectedDay.dayNumber}</h2>
              <Carousel
                nextLabel="Next"
                prevLabel="Previous"
                indicators={false}
                interval={3000} // Auto-scroll every 3 seconds
              >
                {/* Slide for Meal 1 */}
                <Carousel.Item>
                  <div className={styles.carouselDayContent}>
                    <h3 className={styles.mealHeading}>Meal 1</h3>
                    {selectedDay.meal1 && selectedDay.meal1.length > 0 ? (
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
                          {selectedDay.meal1.map((item, i) => (
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
                </Carousel.Item>

                {/* Slide for Meal 2 */}
                <Carousel.Item>
                  <div className={styles.carouselDayContent}>
                    <h3 className={styles.mealHeading}>Meal 2</h3>
                    {selectedDay.meal2 && selectedDay.meal2.length > 0 ? (
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
                          {selectedDay.meal2.map((item, i) => (
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
                </Carousel.Item>
              </Carousel>
            </div>
          ) : (
            <p>Please select a day.</p>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default DietPage;
