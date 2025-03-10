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
      {/* ========== NAVBAR ========== */}
      <Navbar expand="lg" className="mb-3">
        <Container fluid>
          <Navbar.Brand href="#">
            <img
              src={logo}
              alt="Fitnesstan Logo"
              style={{ height: "50px", width: "auto" }}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* Example Nav links (optional) */}
            <Nav className="ms-auto">
              <Nav.Link href="/dashboard">Home</Nav.Link>
              <Nav.Link href="/profile">Profile</Nav.Link>
              <Nav.Link href="/settings">Settings</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ========== MAIN CONTENT ========== */}
      <Container fluid>
        <Row>
          {/* SIDEBAR */}
          <Col md={2} className={styles.sidebar}>
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
          </Col>

          {/* DASHBOARD CONTENT */}
          <Col md={10} className={styles.mainContent}>
            {/* ========== ROW FOR MEASUREMENTS (3 COLUMNS) ========== */}
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

            {/* ========== ROW FOR DIET & EXERCISE FEATURES (2 COLUMNS) ========== */}
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
                      {/* Additional meal plan details */}
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
                  {/* Additional exercise UI elements */}
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      {/* ========== FOOTER ========== */}
      <Footer />
    </div>
  );
};

export default UserDashboard;
