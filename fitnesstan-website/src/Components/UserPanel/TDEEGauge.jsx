// src/components/TDEEGauge.jsx
import React from "react";
import GaugeChart from "react-gauge-chart";

const TDEEGauge = ({ tdeeValue = 2000 }) => {
  const numericTDEE = Number(tdeeValue) || 0;
  const maxTDEE = 4000; // Example upper limit
  const fraction = Math.min(numericTDEE / maxTDEE, 1);

  return (
    <div style={{ width: "300px", margin: "0 auto", textAlign: "center" }}>
      {/* 1) Hide the text inside the gauge, 2) Show needle at 'fraction' */}
      <GaugeChart
        id="tdee-gauge"
        nrOfLevels={3}                         // 3 segments (deficit, maintenance, surplus)
        arcsLength={[0.33, 0.33, 0.34]}
        colors={["#ffeb3b", "#4caf50", "#f44336"]}
        percent={fraction}
        arcWidth={0.3}
        needleColor="#757575"
        needleBaseColor="#757575"
        hideText={true}                       // Hide the numeric label from center
        textColor="#fff"
      />

      {/* 2) Show numeric TDEE below the gauge */}
      <p style={{ marginTop: "0.5rem", color: "#fff" }}>
        TDEE = {numericTDEE.toFixed(0)} cal
      </p>

      {/* 3) Add a simple legend (color boxes + text) */}
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
              backgroundColor: "#ffeb3b",
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
              backgroundColor: "#4caf50",
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
              backgroundColor: "#f44336",
            }}
          />
          <span style={{ fontSize: "0.9rem" }}>Surplus</span>
        </div>
      </div>
    </div>
  );
};

export default TDEEGauge;
