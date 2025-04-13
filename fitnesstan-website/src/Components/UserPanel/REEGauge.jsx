// src/components/REEGauge.jsx
import React from "react";
import GaugeChart from "react-gauge-chart";

// Helper to calculate age from a date string (e.g., "2004-01-18")
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const diffMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// Compute maximum REE based on age using a piecewise function:
// - For age < 16: 1800 cal
// - For age 16 to 25: linearly interpolate from 1800 to 2500 cal
// - For age between 25 and 60: 2500 cal
// - For age > 60: 2200 cal
const computeMaxREEBasedOnAge = (age) => {
  if (age < 16) {
    return 1800;
  } else if (age < 25) {
    // Linear interpolation between 16 and 25 years (9 years span)
    return 1800 + (age - 16) * ((2500 - 1800) / 9);
  } else if (age <= 60) {
    return 2500;
  } else {
    return 2200;
  }
};

const REEGauge = ({ reeValue = 1500, dob }) => {
  const numericREE = Number(reeValue) || 0;
  let maxREE = 2500; // default maximum for adult users

  if (dob) {
    const age = calculateAge(dob);
    maxREE = computeMaxREEBasedOnAge(age);
  }

  const fraction = Math.min(numericREE / maxREE, 1);

  return (
    <div style={{ width: "300px", margin: "0 auto", textAlign: "center" }}>
      <GaugeChart
        id="ree-gauge"
        nrOfLevels={3}
        arcsLength={[0.3, 0.4, 0.3]}
        colors={["#ffeb3b", "#4caf50", "#f44336"]}
        percent={fraction}
        arcWidth={0.3}
        needleColor="#757575"
        needleBaseColor="#757575"
        hideText={true}
        textColor="#fff"
      />
      <p style={{ marginTop: "0.5rem", color: "#fff" }}>
        REE = {numericREE.toFixed(0)} cal 
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
          <div style={{ width: "16px", height: "16px", backgroundColor: "#ffeb3b" }} />
          <span style={{ fontSize: "0.9rem" }}>Deficit</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <div style={{ width: "16px", height: "16px", backgroundColor: "#4caf50" }} />
          <span style={{ fontSize: "0.9rem" }}>Maintenance</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <div style={{ width: "16px", height: "16px", backgroundColor: "#f44336" }} />
          <span style={{ fontSize: "0.9rem" }}>Surplus</span>
        </div>
      </div>
    </div>
  );
};

export default REEGauge;
