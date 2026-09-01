// src/components/aqDashboard/StatCard.jsx
import React from "react";

export default function StatCard({ label, value, sub, isActive = true }) {
  return (
    <div className="aq-card" style={{ position: "relative" }}>
      {/* STATUS DOT INDICATOR */}
      <div 
        title={isActive ? "Sensor Active" : "Sensor Offline/Stuck"}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: isActive ? "#22c55e" : "#ef4444", // Green or Red
          boxShadow: isActive ? "0 0 8px #22c55e" : "none",
          transition: "background-color 0.3s"
        }}
      />

      <div className="aq-card-top">
        <span className="aq-card-label">{label}</span>
        {sub && <span className="aq-card-sub">{sub}</span>}
      </div>
      <div className="aq-card-value">{value}</div>
      <div className="aq-card-meta">
        {isActive ? "Live" : "No Signal"}
      </div>
    </div>
  );
}