// src/components/BMIGauge.jsx
import React from "react";
import GaugeChart from "react-gauge-chart";

const BMIGauge = ({ bmiValue = 22.5 }) => {
  const numericBMI = Number(bmiValue) || 0;

  const minBMI = 13;
  const maxBMI = 40;
  const range = maxBMI - minBMI; // 27

  const fraction = Math.min(Math.max((numericBMI - minBMI) / range, 0), 1);

  const arcsLength = [
    (18.5 - minBMI) / range, 
    (25 - 18.5) / range,     
    (30 - 25) / range,       
    (40 - 30) / range        
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

      {/* Responsive Legend */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",       // Allow legend items to wrap on smaller screens
          gap: "1rem",            // Space between items
          justifyContent: "center",
          marginTop: "0.5rem",
        }}
      >
        {/* Underweight */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <div
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: "#2196f3",
            }}
          />
          <span style={{ fontSize: "0.9rem" }}>Underweight</span>
        </div>

        {/* Normal */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <div
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: "#4caf50",
            }}
          />
          <span style={{ fontSize: "0.9rem" }}>Normal</span>
        </div>

        {/* Overweight */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <div
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: "#ffeb3b",
            }}
          />
          <span style={{ fontSize: "0.9rem" }}>Overweight</span>
        </div>

        {/* Obese */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <div
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: "#f44336",
            }}
          />
          <span style={{ fontSize: "0.9rem" }}>Obese</span>
        </div>
      </div>
    </div>
  );
};

export default BMIGauge;
