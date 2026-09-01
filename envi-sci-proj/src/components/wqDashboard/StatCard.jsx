import React from "react";

export default function StatCard({ label, value, sub }) {
  return (
    <div className="wq-card">
      <div className="wq-card-top">
        <span className="wq-card-label">{label}</span>
        {sub && <span className="wq-card-sub">{sub}</span>}
      </div>
      <div className="wq-card-value">{value}</div>
      <div className="wq-card-meta">Last updated: now</div>
    </div>
  );
}