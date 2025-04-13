// src/components/BMIGauge.jsx
import React from "react";
import GaugeChart from "react-gauge-chart";

// Helper function to calculate age from a date string (or Date object)
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const m = now.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const BMIGauge = ({ bmiValue = 22.5, dob, gender = "male" }) => {
  const numericBMI = Number(bmiValue) || 0;
  const minBMI = 13;
  const maxBMI = 42;
  const range = maxBMI - minBMI;

  // Set thresholds based on age and gender (using backend logic)
  let lowerBMI, upperBMI;
  if (dob) {
    const age = calculateAge(dob);
    if (gender.toLowerCase() === "male") {
      if (age >= 18 && age <= 34) {
        lowerBMI = 18.7;
        upperBMI = 25.9;
      } else if (age >= 35 && age <= 44) {
        lowerBMI = 23.0;
        upperBMI = 26.9;
      } else if (age >= 45 && age <= 54) {
        lowerBMI = 24.0;
        upperBMI = 27.9;
      } else {
        lowerBMI = 18.5;
        upperBMI = 24.9;
      }
    } else { // female
      if (age >= 18 && age <= 34) {
        lowerBMI = 15.5;
        upperBMI = 21.9;
      } else if (age >= 35 && age <= 44) {
        lowerBMI = 19.0;
        upperBMI = 23.9;
      } else if (age >= 45 && age <= 54) {
        lowerBMI = 20.0;
        upperBMI = 25.9;
      } else {
        lowerBMI = 15.5;
        upperBMI = 22.9;
      }
    }
  } else {
    // Default adult thresholds if no dob provided
    lowerBMI = 18.5;
    upperBMI = 24.9;
  }
  // For the gauge we assume that overweight starts at 29.9 (as a fixed value)
  const overweightThreshold = 29.9;

  // Compute arcs lengths for the gauge:
  const arcUnderweight = (lowerBMI - minBMI) / range;            // Underweight portion
  const arcNormal = (upperBMI - lowerBMI) / range;                 // Normal portion
  const arcOverweight = (overweightThreshold - upperBMI) / range;  // Overweight portion
  const arcObese = (maxBMI - overweightThreshold) / range;         // Obese portion
  const arcsLength = [arcUnderweight, arcNormal, arcOverweight, arcObese];

  // Compute the fraction for the needle position
  const fraction = Math.min(Math.max((numericBMI - minBMI) / range, 0), 1);

  return (
    <div style={{ width: "300px", margin: "0 auto", textAlign: "center" }}>
      <GaugeChart
        id="bmi-gauge"
        nrOfLevels={4}
        arcsLength={arcsLength}
        colors={["#2196f3", "#4caf50", "#ffeb3b", "#f44336"]}
        percent={fraction}
        arcWidth={0.3}
        needleColor="#757575"
        needleBaseColor="#757575"
        hideText={true}
        textColor="#fff"
      />
      <p style={{ marginTop: "0.5rem", color: "#fff" }}>
        BMI = {numericBMI.toFixed(1)}
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "center",
          marginTop: "0.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <div style={{ width: "16px", height: "16px", backgroundColor: "#2196f3" }} />
          <span style={{ fontSize: "0.9rem" }}>Underweight</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <div style={{ width: "16px", height: "16px", backgroundColor: "#4caf50" }} />
          <span style={{ fontSize: "0.9rem" }}>Normal</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <div style={{ width: "16px", height: "16px", backgroundColor: "#ffeb3b" }} />
          <span style={{ fontSize: "0.9rem" }}>Overweight</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <div style={{ width: "16px", height: "16px", backgroundColor: "#f44336" }} />
          <span style={{ fontSize: "0.9rem" }}>Obese</span>
        </div>
      </div>
    </div>
  );
};

export default BMIGauge;
