// src/components/BMIGauge.jsx
import React from "react";
import GaugeChart from "react-gauge-chart";

// Helper function to calculate age from a date string (e.g., "2004-01-18")
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const diffMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const BMIGauge = ({ bmiValue = 22.5, dob }) => {
  const numericBMI = Number(bmiValue) || 0;
  const minBMI = 12;
  const maxBMI = 42;
  const range = maxBMI - minBMI;

  // Set BMI thresholds based on age if dob is provided
  let underweightThreshold, normalThreshold, overweightThreshold;
  if (dob) {
    const age = calculateAge(dob);
    if (age < 18) {
      // For users younger than 18, use modified thresholds
      underweightThreshold = 16;
      normalThreshold = 21;
      overweightThreshold = 26;
    } else {
      // For adults, use standard thresholds
      underweightThreshold = 18.5;
      normalThreshold = 24.9;
      overweightThreshold = 29.9;
    }
  } else {
    // If no dob provided, default to adult thresholds
    underweightThreshold = 18.5;
    normalThreshold = 24.9;
    overweightThreshold = 29.9;
  }

  // Compute arcs lengths for the gauge chart based on thresholds
  const arcsLength = [
    (underweightThreshold - minBMI) / range,         // Underweight arc
    (normalThreshold - underweightThreshold) / range,  // Normal arc
    (overweightThreshold - normalThreshold) / range,   // Overweight arc
    (maxBMI - overweightThreshold) / range,            // Obese arc
  ];

  // Compute the fraction for the gauge
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
