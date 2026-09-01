// src/components/aqDashboard/Sidebar.jsx
import React from "react";

export default function Sidebar({ temperature }) {
  const today = new Date().toLocaleDateString();

  return (
    <aside className="aq-sidebar">
      <div>
        <div className="aq-location">Ermita, Manila</div>
        <div className="aq-temp-big">
          <span>{temperature}°</span>
          <span className="aq-temp-label">Sunny</span>
        </div>
      </div>

      <div className="aq-sidebar-footer">
        <span>Today • {today}</span>
      </div>
    </aside>
  );
}
