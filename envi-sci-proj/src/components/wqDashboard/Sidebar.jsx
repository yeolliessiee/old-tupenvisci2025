import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ ph }) {
  // Determine water quality status based on pH
  const getQualityStatus = (phValue) => {
    if (phValue >= 6.5 && phValue <= 8.5) return { text: "Good", color: "#4caf50" };
    if (phValue >= 6.0 && phValue < 6.5) return { text: "Fair", color: "#ff9800" };
    if (phValue > 8.5 && phValue <= 9.0) return { text: "Fair", color: "#ff9800" };
    return { text: "Poor", color: "#f44336" };
  };

  const status = getQualityStatus(ph);

  return (
    <div className="wq-sidebar">
      <div className="wq-sidebar-header">
        <div className="wq-location">
          <span className="wq-location-icon">📍</span>
          <div className="wq-location-text">
            <div className="wq-location-name">Ermita, Manila</div>
            <div className="wq-location-sub">Philippines</div>
          </div>
        </div>
      </div>

      <div className="wq-status-card">
        <div className="wq-status-header">
          <span className="wq-status-icon">💧</span>
          <span className="wq-status-title">Water Status</span>
        </div>
        <div className="wq-status-main">
          <div className="wq-status-value" style={{ color: status.color }}>
            {status.text}
          </div>
          <div className="wq-status-ph">pH: {ph.toFixed(2)}</div>
        </div>
        <div className="wq-status-footer">
          <span className="wq-status-dot" style={{ backgroundColor: status.color }}></span>
          <span className="wq-status-live">Live monitoring</span>
        </div>
      </div>



      <div className="wq-sidebar-footer">
        <div className="wq-footer-label">Environmental Science Project</div>
        <div className="wq-footer-section">Section B - Water Monitoring</div>
      </div>
    </div>
  );
}