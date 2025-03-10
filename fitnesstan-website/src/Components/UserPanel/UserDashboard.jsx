// src/components/UserDashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";

// React Bootstrap components
import { Container, Row, Col, Navbar, Nav } from "react-bootstrap";

// Import your custom module CSS (optional)
import styles from "./UserDashboard.module.css";

// Your logo asset
import logo from "../../Assets/FIRNESSTAN_BARA_LOGO.png";

import Footer from "../../Components/Footer"; // Adjust the path as necessary

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

  // Fetch user measurements
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
        {/* Toggle Button (top-left) */}
        <button
          className={styles.toggleBtn}
          onClick={() => setSidebarVisible(!sidebarVisible)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Centered Logo */}
        <div className={styles.navbarLogoWrapper}>
          <img
            src={logo}
            alt="Fitnesstan Logo"
            style={{ height: '50px', width: 'auto' }}
          />
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
            <li>
              <a href="/dashboard">Dashboard</a>
            </li>
            <li>
              <a href="/profile">Profile</a>
            </li>
            <li>
              <a href="/diet">Diet Plan</a>
            </li>
            <li>
              <a href="/exercise">Exercise</a>
            </li>
            <li>
              <a href="/settings">Settings</a>
            </li>
          </ul>
        </div>

        {/* Main content area */}
        <div className={styles.mainContent}>
          <Row className="mt-4">
            <Col md={4}>
              <div className={styles.measurementBox}>
                <h3>BMI</h3>
                <p>{measurements.bmi}</p>
              </div>
            </Col>
            <Col md={4}>
              <div className={styles.measurementBox}>
                <h3>REE</h3>
                <p>{measurements.ree}</p>
              </div>
            </Col>
            <Col md={4}>
              <div className={styles.measurementBox}>
                <h3>TDEE</h3>
                <p>{measurements.tdee}</p>
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

      {/* ===== FOOTER ===== */}
      <Footer />
    </div>
  );
};

export default UserDashboard;