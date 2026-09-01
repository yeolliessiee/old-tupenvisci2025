import React from "react";

export default function Header() {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="wq-header">
      <div>
        <h1 className="wq-header-title">Water Quality Dashboard</h1>
        <p className="wq-header-subtitle">Real-time sensor monitoring</p>
      </div>
      <div className="wq-header-time">
        <div className="wq-date">{dateStr}</div>
        <div className="wq-time">{timeStr}</div>
      </div>
    </header>
  );
}