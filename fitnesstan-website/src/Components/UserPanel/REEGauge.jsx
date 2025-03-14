// src/components/REEGauge.jsx
import React from "react";
import GaugeChart from "react-gauge-chart";

const REEGauge = ({ reeValue = 1500 }) => {
  const numericREE = Number(reeValue) || 0;
  const maxREE = 2500;
  const fraction = Math.min(numericREE / maxREE, 1);

  return (
    <div style={{ width: "300px", margin: "0 auto", textAlign: "center" }}>
      <GaugeChart
        id="ree-gauge"
        nrOfLevels={3}
        arcsLength={[0.33, 0.33, 0.34]}
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
          <div
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: "#ffeb3b",
            }}
          />
          <span style={{ fontSize: "0.9rem" }}>Deficit</span>
        </div>
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

export default REEGauge;
