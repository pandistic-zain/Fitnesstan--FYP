// src/components/UserDashboard.js
import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { MdDashboard } from "react-icons/md";
import { FaAppleAlt, FaDumbbell, FaKey } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { getFullUserData } from "../../API/RegisterAPI";

import Footer from "../../Components/Footer";
import BMIGauge from "./BMIGauge";
import TDEEGauge from "./TDEEGauge";
import REEGauge from "./REEGauge";
import DietCarousel from "./DietCarousel";
import ExerciseCarousel from "./ExerciseCarousel";

import styles from "./UserDashboard.module.css";
import logo from "../../Assets/FITNESSTAN BARA LOGO_inverted.png";

const UserDashboard = () => {
  const [measurements, setMeasurements] = useState({
    bmi: "--",
    ree: "--",
    tdee: "--",
    dob: null, // include dob here
  });
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();

  // On mount, read userData from localStorage.
  useEffect(() => {

    getFullUserData()
      .then((dto) => {

        // Check if the necessary objects exist
        if (!dto || !dto.diet || !dto.diet.mealPlan || !dto.workoutPlan) {
          console.warn("[WARN] No diet or mealPlan/workoutPlan found in user data.");
          return;
        }

        // Check if the endDate for the current diet exists and is valid
        if (dto.diet && dto.diet.endDate) {
          const dietEndDate = new Date(dto.diet.endDate);
          const currentDate = new Date();
          console.log("Checking currentDiet endDate:", dietEndDate);

          if (dietEndDate <= currentDate) {
            navigate("/ReSubmitData"); // Redirect to resubmit page if the date has passed
            return;
          }
        }

        // Check if the endDate for the current workout plan exists and is valid
        if (dto.workoutPlan && dto.workoutPlan.endDate) {
          const workoutEndDate = new Date(dto.workoutPlan.endDate);
          const currentDate = new Date();
          console.log("Checking currentWorkoutPlan endDate:", workoutEndDate);

          if (workoutEndDate <= currentDate) {
            navigate("/ReSubmitData"); // Redirect to resubmit page if the date has passed
            return;
          }
        }
      })
      .catch((err) => {
        console.error("[ERROR] Fetching user data failed:", err);
      });


    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setMeasurements({
          bmi: parsedData.bmi || "--",
          ree: parsedData.ree || "--",
          tdee: parsedData.tdee || "--",
          dob: parsedData.dob || null,
        });
      } catch (error) {
        console.error("Error parsing userData from localStorage:", error);
      }
    }
  }, []);

  // Hide sidebar on scroll
  useEffect(() => {
    const handleScroll = () => setSidebarVisible(false);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sign-out function: clears credentials and navigates to home while replacing history.
  const signOut = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    navigate("/", { replace: true });
  };

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
              <Link to="/DietPage" className={styles.link}>
                <FaAppleAlt className={styles.icon} />
                Diet Plan
              </Link>
            </li>
            <li className={styles.sidebarItem}>
              <Link to="/ExercisePage" className={styles.link}>
                <FaDumbbell className={styles.icon} />
                Exercise
              </Link>
            </li>
            <li className={styles.sidebarItem}>
              <Link to="/ChangePassword" className={styles.link}>
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
          {/* HERO SECTION */}
          <div className={styles.heroSection}>
            <div className={styles.slideshowContainer}>
              {/* Slideshow logic if needed */}
            </div>
            <div className={styles.darkOverlay}></div>
            <div className={styles.greetingContainer}>
              <h1>Welcome to Fitnesstan</h1>
              <p>
                Embark on your journey to peak performance with our tailored
                fitness and nutrition solutions 🏋️‍♀️🥗. Our expert-designed
                workout programs and personalized meal strategies empower you to
                achieve your health goals with precision and support 💪🏃‍♂️.
              </p>
            </div>
          </div>

          {/* AFTER HERO CONTENT: Health Metrics */}
          <div className={styles.AfterHeroContent}>
            <h2 className={styles.sectionHeading}>
              Your Intelligent Health Metrics
            </h2>
            <Row className="mt-4 align-items-stretch">
              <Col md={4}>
                <div className={styles.measurementBox}>
                  <BMIGauge
                    bmiValue={measurements.bmi}
                    dob={measurements.dob}
                  />
                </div>
              </Col>
              <Col md={4}>
                <div className={styles.measurementBox}>
                  <TDEEGauge
                    tdeeValue={measurements.tdee}
                    dob={measurements.dob}
                  />
                </div>
              </Col>
              <Col md={4}>
                <div className={styles.measurementBox}>
                  <REEGauge
                    reeValue={measurements.ree}
                    dob={measurements.dob}
                  />
                </div>
              </Col>
            </Row>
          </div>

          {/* AFTER MEASUREMENT CONTENT: Carousels */}
          <div className={styles.AfterMeasurementContent}>
            <Row className="mt-4">
              <h2>Diet Plan</h2>
              <DietCarousel />
            </Row>
            <Row className="mt-4">
              <h2>Exercise Features</h2>
              <ExerciseCarousel />
            </Row>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default UserDashboard;
