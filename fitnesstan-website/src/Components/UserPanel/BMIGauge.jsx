// src/components/BMIGauge.jsx
import React from "react";
import GaugeChart from "react-gauge-chart";

const BMIGauge = ({ bmiValue = 22.5 }) => {
  const numericBMI = Number(bmiValue) || 0;
  const minBMI = 12;
  const maxBMI = 42;
  const range = maxBMI - minBMI; // 27
  const fraction = Math.min(Math.max((numericBMI - minBMI) / range, 0), 1);

  const arcsLength = [
    (18.5 - minBMI) / range,  // Underweight: (18.5 - 12) / 30 ≈ 0.2167
    (24.9 - 18.5) / range,    // Normal: (24.9 - 18.5) / 30 ≈ 0.2133
    (29.9 - 24.9) / range,    // Overweight: (29.9 - 24.9) / 30 ≈ 0.1667
    (maxBMI - 29.9) / range   // Obese: (42 - 29.9) / 30 ≈ 0.4033
  ];

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
