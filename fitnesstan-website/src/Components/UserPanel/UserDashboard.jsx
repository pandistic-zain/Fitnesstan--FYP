// src/components/UserDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserDashboard.module.css'; // Create and style this file as needed
import logo from '../../Assets/FIRNESSTAN_BARA_LOGO.png'; // Adjust path to your logo image

const UserDashboard = () => {
  // State for measurements (BMI, REE, TDEE)
  const [measurements, setMeasurements] = useState({
    bmi: '--',
    ree: '--',
    tdee: '--'
  });

  // State for diet plan details
  const [diet, setDiet] = useState(null);

  // Fetch user measurements
  useEffect(() => {
    axios.get('http://localhost:8080/user/user@example.com')
      .then(response => {
        setMeasurements({
          bmi: response.data.bmi,
          ree: response.data.ree,
          tdee: response.data.tdee,
        });
      })
      .catch(error => {
        console.error('Error fetching measurements:', error);
      });
  }, []);

  // Fetch diet plan details
  useEffect(() => {
    axios.get('http://localhost:8080/user/diet')
      .then(response => {
        setDiet(response.data);
      })
      .catch(error => {
        console.error('Error fetching diet plan:', error);
      });
  }, []);

  return (
    <div className="user-dashboard-container">
      {/* Navbar with Logo */}
      <header className="navbar">
        <img src={logo} alt="Fitnesstan Logo" className="navbar-logo" />
      </header>

      <div className="dashboard-body">
        {/* Sidebar for User Actions */}
        <aside className="sidebar">
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/diet">Diet Plan</a></li>
            <li><a href="/exercise">Exercise</a></li>
            <li><a href="/settings">Settings</a></li>
          </ul>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-content">
          {/* Measurements Section: Three Square Boxes */}
          <section className="measurements-section">
            <div className="measurement-box">
              <h3>BMI</h3>
              <p>{measurements.bmi}</p>
            </div>
            <div className="measurement-box">
              <h3>REE</h3>
              <p>{measurements.ree}</p>
            </div>
            <div className="measurement-box">
              <h3>TDEE</h3>
              <p>{measurements.tdee}</p>
            </div>
          </section>

          {/* Features Section: Diet and Exercise */}
          <section className="features-section">
            {/* Diet Section */}
            <div className="diet-section">
              <h2>Diet Plan</h2>
              {diet ? (
                <div>
                  <p><strong>Plan Start:</strong> {diet.startDate}</p>
                  <p><strong>Plan End:</strong> {diet.endDate}</p>
                  {/* Add additional meal plan details if needed */}
                </div>
              ) : (
                <p>Loading diet plan...</p>
              )}
            </div>

            {/* Exercise Section */}
            <div className="exercise-section">
              <h2>Exercise Features</h2>
              <p>Track your exercise routines and progress here.</p>
              {/* Additional exercise UI elements can be added here */}
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Fitnesstan. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UserDashboard;
