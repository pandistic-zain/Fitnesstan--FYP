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

const UserDashboard = () => {
  // State for measurements (BMI, REE, TDEE)
  const [measurements, setMeasurements] = useState({
    bmi: "--",
    ree: "--",
    tdee: "--",
  });

  // State for diet plan details
  const [diet, setDiet] = useState(null);

  // State to control sidebar visibility
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    // Example: close sidebar on scroll
    const handleScroll = () => {
      // If user scrolls, hide the sidebar
      setSidebarVisible(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fetch user data
  useEffect(() => {
    axios
      .get("http://localhost:8080/user/user@example.com")
      .then((response) => {
        setMeasurements({
          bmi: response.data.bmi,
          ree: response.data.ree,
          tdee: response.data.tdee,
        });
      })
      .catch((error) => {
        console.error("Error fetching measurements:", error);
      });
  }, []);

  // Fetch diet plan details
  useEffect(() => {
    axios
      .get("http://localhost:8080/user/diet")
      .then((response) => {
        setDiet(response.data);
      })
      .catch((error) => {
        console.error("Error fetching diet plan:", error);
      });
  }, []);

  return (
    <div className={styles.dashboardWrapper}>
      {/* ===== NAVBAR ===== */}
      <nav className={`navbar navbar-expand-lg ${styles.navbarCustom}`}>
        {/* Custom Toggle */}
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

        {/* Centered Logo */}
        <div className={styles.navbarLogoWrapper}>
          <img src={logo} alt="Fitnesstan Logo" style={{ height: "50px" }} />
        </div>
      </nav>

      {/* ===== SIDEBAR + MAIN CONTENT ===== */}
      <div className={styles.layoutContainer}>
        {/* Sidebar */}
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
        <div className={styles.mainContent}>
        {/* ===== HERO SECTION ===== */}
        <Row className="g-0">
        <div className={styles.heroSection}>
          <div className={styles.slideshowContainer}>
            {/* Optionally place your slideshow logic here */}
          </div>
          {/* Dark overlay */}
          <div className={styles.darkOverlay}></div>
          {/* Greeting text */}
          <div className={styles.greetingContainer}>
            <h1>Welcome to Fitnesstan!</h1>
            <p>Your personalized journey starts here.</p>
          </div>
        </div>
        </Row>

        {/* Main content area */}
        <div className={styles.AfterHeroContent}>
          <Row className="mt-4 align-items-stretch">
            <Col md={4}>
              <div className={styles.measurementBox}>
                <BMIGauge bmiValue="54.2" />
              </div>
            </Col>
            <Col md={4}>
              <div className={styles.measurementBox}>
                <TDEEGauge tdeeValue="2855" />
              </div>
            </Col>
            <Col md={4}>
              <div className={styles.measurementBox}>
                <REEGauge reeValue="1600" />
              </div>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={6}>
              <div className={styles.featureBox}>
                <h2>Diet Plan</h2>
                {diet ? (
                  <div>
                    <p>
                      <strong>Plan Start:</strong> {diet.startDate}
                    </p>
                    <p>
                      <strong>Plan End:</strong> {diet.endDate}
                    </p>
                  </div>
                ) : (
                  <p>Loading diet plan...</p>
                )}
              </div>
            </Col>
            <Col md={6}>
              <div className={styles.featureBox}>
                <h2>Exercise Features</h2>
                <p>Track your exercise routines and progress here.</p>
              </div>
            </Col>
          </Row>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <Footer />
    </div>
  );
};

export default UserDashboard;
