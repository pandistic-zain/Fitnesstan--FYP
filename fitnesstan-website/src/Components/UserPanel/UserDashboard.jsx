// src/components/UserDashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import { MdDashboard } from "react-icons/md";
import { FaAppleAlt, FaDumbbell, FaKey } from "react-icons/fa";

import Footer from "../../Components/Footer";
import styles from "./UserDashboard.module.css";
import logo from "../../Assets/FITNESSTAN BARA LOGO_inverted.png";

import BMIGauge from "./BMIGauge";
import TDEEGauge from "./TDEEGauge";
import REEGauge from "./REEGauge";
import DietCarousel from "./DietCarousel";
import ExerciseCarousel from "./ExerciseCarousel";

const UserDashboard = () => {
  const [measurements, setMeasurements] = useState({ bmi: "--", ree: "--", tdee: "--" });
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [dietItems, setDietItems] = useState([]);
  const [exerciseItems, setExerciseItems] = useState([]);

  // On mount, read userData from localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setMeasurements({
        bmi: parsedData.bmi || "--",
        ree: parsedData.ree || "--",
        tdee: parsedData.tdee || "--",
      });
    }
  }, []);

  // Fetch dietItems and exerciseItems from backend
  useEffect(() => {
    axios.get("http://localhost:8080/user/dietItems")
      .then((response) => setDietItems(response.data))
      .catch((error) => console.error("Error fetching diet items:", error));

    axios.get("http://localhost:8080/user/exerciseItems")
      .then((response) => setExerciseItems(response.data))
      .catch((error) => console.error("Error fetching exercise items:", error));
  }, []);

  // Hide sidebar on scroll
  useEffect(() => {
    const handleScroll = () => setSidebarVisible(false);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
              <a href="/userdashboard">
                <MdDashboard className={styles.icon} />
                Dashboard
              </a>
            </li>
            <li className={styles.sidebarItem}>
              <a href="/diet">
                <FaAppleAlt className={styles.icon} />
                Diet Plan
              </a>
            </li>
            <li className={styles.sidebarItem}>
              <a href="/exercise">
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
          <button className={styles.button}>SIGN OUT</button>
        </div>

        {/* MAIN CONTENT */}
        <div className={styles.mainContent}>
          {/* HERO SECTION */}
          <div className={styles.heroSection}>
            <div className={styles.slideshowContainer}>
              {/* Optionally place your slideshow logic here */}
            </div>
            <div className={styles.darkOverlay}></div>
            <div className={styles.greetingContainer}>
              <h1>Welcome to Fitnesstan!</h1>
              <p>Your personalized journey starts here.</p>
            </div>
          </div>

          {/* AFTER HERO CONTENT */}
          <div className={styles.AfterHeroContent}>
            {/* MEASUREMENT BOXES */}
            <Row className="mt-4 align-items-stretch">
              <Col md={4}>
                <div className={styles.measurementBox}>
                  <BMIGauge bmiValue={measurements.bmi} />
                </div>
              </Col>
              <Col md={4}>
                <div className={styles.measurementBox}>
                  <TDEEGauge tdeeValue={measurements.tdee} />
                </div>
              </Col>
              <Col md={4}>
                <div className={styles.measurementBox}>
                  <REEGauge reeValue={measurements.ree} />
                </div>
              </Col>
            </Row>

            {/* FEATURE BOXES AS CAROUSELS */}
            <Row className="mt-4">
              <Col md={6}>
                <div className={styles.featureBox}>
                  <h2>Diet Plan</h2>
                  {dietItems.length > 0 ? (
                    <DietCarousel dietItems={dietItems} />
                  ) : (
                    <p>Loading diet items...</p>
                  )}
                </div>
              </Col>
              <Col md={6}>
                <div className={styles.featureBox}>
                  <h2>Exercise Features</h2>
                  {exerciseItems.length > 0 ? (
                    <ExerciseCarousel exerciseItems={exerciseItems} />
                  ) : (
                    <p>Loading exercise items...</p>
                  )}
                </div>
              </Col>
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
