// src/components/TDEEGauge.jsx
import React from "react";
import GaugeChart from "react-gauge-chart";

// Helper to calculate age from dob (expected format: YYYY-MM-DD)
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const diffMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// Compute maximum TDEE based on age with a piecewise function:
// - For age < 16: maxTDEE = 3500 cal
// - For age between 16 and 20: linear interpolation from 3500 (at 16) to 4500 (at 20)
// - For age between 20 and 60: linear interpolation from 4500 (at 20) to 3500 (at 60)
// - For age > 60: maxTDEE = 3500 cal
const computeMaxTDEEBasedOnAge = (age) => {
  if (age < 16) {
    return 3500;
  } else if (age < 20) {
    // Linear interpolation from 3500 at age 16 to 4500 at age 20
    return 3500 + (age - 16) * ((4500 - 3500) / 4);
  } else if (age <= 60) {
    // Linear interpolation from 4500 at age 20 to 3500 at age 60
    return 4500 - ((age - 20) * ((4500 - 3500) / 40));
  } else {
    return 3500;
  }
};

const TDEEGauge = ({ tdeeValue = 2000, dob }) => {
  const numericTDEE = Number(tdeeValue) || 0;
  let maxTDEE = 4500; // default maximum for adults

  if (dob) {
    const age = calculateAge(dob);
    maxTDEE = computeMaxTDEEBasedOnAge(age);
  }

  const fraction = Math.min(numericTDEE / maxTDEE, 1);

  return (
    <div style={{ width: "300px", margin: "0 auto", textAlign: "center" }}>
      <GaugeChart
        id="tdee-gauge"
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
        TDEE = {numericTDEE.toFixed(0)} cal 
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

export default TDEEGauge;
