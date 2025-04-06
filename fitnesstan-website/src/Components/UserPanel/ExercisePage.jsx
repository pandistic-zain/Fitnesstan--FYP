// src/components/ExercisePage.jsx
import React, { useState, useEffect } from "react";
import { Row } from "react-bootstrap";
import { MdDashboard } from "react-icons/md";
import { FaAppleAlt, FaDumbbell, FaKey } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { getFullUserData, buildImageUrl } from "../../API/RegisterAPI";
import Footer from "../../Components/Footer";
import styles from "./ExercisePage.module.css";
import logo from "../../Assets/FITNESSTAN BARA LOGO_inverted.png";

// Helper: extract the file name from a full path.
function extractFilename(fullPath = "") {
  const sanitized = fullPath.replace(/\\/g, "/");
  return sanitized.split("/").pop();
}

const ExercisePage = () => {
  const [dayPlans, setDayPlans] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();

  // Fetch full user data and extract all day plans with public GIF URLs.
  useEffect(() => {
    getFullUserData()
      .then((dto) => {
        console.debug("[DEBUG] FullUserInfoDTO:", JSON.stringify(dto, null, 2));
        const workoutPlan = dto.workoutPlan;
        if (!workoutPlan || !workoutPlan.dayPlans) {
          console.warn("[WARN] No workoutPlan or dayPlans found in user data.");
          setLoading(false);
          return;
        }
        const updatedDayPlans = workoutPlan.dayPlans.map((day) => {
          if (day.exercises && day.exercises.length > 0) {
            const updatedExercises = day.exercises.map((exercise) => {
              if (exercise.gifUrl) {
                const fileName = extractFilename(exercise.gifUrl);
                const publicUrl = buildImageUrl(fileName);
                return { ...exercise, gifUrl: publicUrl };
              }
              return exercise;
            });
            return { ...day, exercises: updatedExercises };
          }
          return day;
        });
        setDayPlans(updatedDayPlans);
        // Default to the first day if available.
        setSelectedDay(updatedDayPlans[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("[ERROR] Error fetching full user data:", error);
        setLoading(false);
      });
  }, []);

  // Hide sidebar when scrolling
  useEffect(() => {
    const handleScroll = () => setSidebarVisible(false);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sign out function: clear stored credentials and replace history entry.
  const signOut = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    navigate("/", { replace: true });
  };

  if (loading) {
    return <p>Loading exercises...</p>;
  }

  if (!dayPlans.length) {
    return <p>No exercise data found.</p>;
  }

  return (
    <div className={styles.dashboardWrapper}>
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
          {/* Replace with your logo */}
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
              <Link to="/userdashboard" className={styles.link}>
                <MdDashboard className={styles.icon} />
                Dashboard
              </Link>
            </li>
            <li className={styles.sidebarItem}>
              <Link to="/diet" className={styles.link}>
                <FaAppleAlt className={styles.icon} />
                Diet Plan
              </Link>
            </li>
            <li className={styles.sidebarItem}>
              <Link to="/exercise" className={styles.link}>
                <FaDumbbell className={styles.icon} />
                Exercise
              </Link>
            </li>
            <li className={styles.sidebarItem}>
              <Link to="/settings" className={styles.link}>
                <FaKey className={styles.icon} />
                Change Password
              </Link>
            </li>
          </ul>
          <button className={styles.button} onClick={signOut}>
            SIGN OUT
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className={styles.mainContent}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Exercise Schedule</h1>
          </div>

          {/* Day Toggle: full-width, minimal height, theme-colored */}
          <div className={styles.dayToggle}>
            {dayPlans.map((day) => (
              <button
                key={day.dayNumber}
                className={`${styles.toggleButton} ${
                  selectedDay && selectedDay.dayNumber === day.dayNumber
                    ? styles.active
                    : ""
                }`}
                onClick={() => setSelectedDay(day)}
              >
                Day {day.dayNumber}
              </button>
            ))}
          </div>

          {/* Display selected day's exercises */}
          <div className={styles.dayContent}>
            <h2 className={styles.dayHeading}>Day {selectedDay.dayNumber}</h2>
            {selectedDay.exercises && selectedDay.exercises.length > 0 ? (
              <Carousel
                interval={3000} // Auto-slide every 3 seconds
                nextLabel="Next Exercise"
                prevLabel="Previous Exercise"
                indicators={false}
              >
                {selectedDay.exercises.map((exercise, exIndex) => (
                  <Carousel.Item key={exIndex}>
                    <div className={styles.carouselItemContent}>
                      <h1 className={styles.exerciseName}>{exercise.name}</h1>
                      <h3 className={styles.muscleGroup}>{exercise.muscleGroup}</h3>
                      {exercise.gifUrl ? (
                        <div className={styles.exerciseGifContainer}>
                          <img
                            src={exercise.gifUrl}
                            alt={exercise.name}
                            className={styles.exerciseGif}
                          />
                        </div>
                      ) : null}
                      <p className={styles.description}>
                        {exercise.description}
                      </p>
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <p>No exercises for this day. It's a Rest Day!</p>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default ExercisePage;
