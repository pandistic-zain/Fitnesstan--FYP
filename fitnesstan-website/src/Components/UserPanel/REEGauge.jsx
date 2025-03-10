// src/components/REEGauge.jsx
import React from "react";
import GaugeChart from "react-gauge-chart";

const REEGauge = ({ reeValue = 1500 }) => {
  // Convert reeValue to a number
  const numericREE = Number(reeValue) || 0;

  // Assume REE ranges from 0 to 2500 calories
  const maxREE = 2500;
  const fraction = Math.min(numericREE / maxREE, 1);

  return (
    <div style={{ width: "300px", margin: "0 auto", textAlign: "center" }}>
      {/* Hide the numeric text inside the gauge */}
      <GaugeChart
        id="ree-gauge"
        nrOfLevels={3}                         
        arcsLength={[0.33, 0.33, 0.34]}       // 3 segments
        colors={["#ffeb3b", "#4caf50", "#f44336"]} 
        percent={fraction}
        arcWidth={0.3}
        needleColor="#757575"
        needleBaseColor="#757575"
        hideText={true}                      // No text in the center
        textColor="#fff"
      />

      {/* Display REE below the gauge */}
      <p style={{ marginTop: "0.5rem", color: "#fff" }}>
        REE = {numericREE.toFixed(0)} cal
      </p>

      {/* Legend for Deficit, Maintenance, Surplus */}
      <div
        style={{
            display: "flex",
            flexWrap: "wrap",       // Allow legend items to wrap on smaller screens
            gap: "1rem",            // Space between items
            justifyContent: "center",
            marginTop: "0.5rem",
        }}
      >
        {/* Deficit */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <div
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: "#ffeb3b", // Green
            }}
          />
          <span style={{ fontSize: "0.9rem" }}>Deficit</span>
        </div>

        {/* Maintenance */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <div
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: "#4caf50", // Yellow
            }}
          />
          <span style={{ fontSize: "0.9rem" }}>Maintenance</span>
        </div>

        {/* Surplus */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <div
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: "#f44336", // Red
            }}
          />
          <span style={{ fontSize: "0.9rem" }}>Surplus</span>
        </div>
      </div>
    </div>
  );
};

export default REEGauge;
