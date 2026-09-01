import React from "react";

function pmCategory(pm) {
  if (pm <= 12) return { label: "Good", color: "#4ade80", desc: "Minimal air quality impact" };
  if (pm <= 35) return { label: "Moderate", color: "#facc15", desc: "Acceptable for most" };
  if (pm <= 55) return { label: "Unhealthy", color: "#fb7185", desc: "Sensitive groups affected" };
  return { label: "Very Unhealthy", color: "#f97316", desc: "Health alert — everyone affected" };
}

export default function PMGauge({ pm1 = 0, pm25 = 0, pm10 = 0, isActive = true }) {
  const c1 = pmCategory(pm1);
  const c25 = pmCategory(pm25);
  const c10 = pmCategory(pm10);

  const width25 = Math.min(100, Math.round((pm25 / 80) * 100));
  const width10 = Math.min(100, Math.round((pm10 / 200) * 100));
  const width1 = Math.min(100, Math.round((pm1 / 50) * 100));

  return (
    <div className="aq-card" style={{ position: "relative" }}>
      {/* STATUS DOT INDICATOR */}
      <div 
        title={isActive ? "Sensor Active" : "Sensor Offline/Stuck"}
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "11px",
          color: isActive ? "#15803d" : "#b91c1c",
          fontWeight: "600",
          backgroundColor: isActive ? "#dcfce7" : "#fee2e2",
          padding: "2px 8px",
          borderRadius: "12px"
        }}
      >
        <div style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: isActive ? "#22c55e" : "#ef4444",
        }} />
        {isActive ? "SENSOR ONLINE" : "CHECK SENSOR"}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h3 className="aq-section-title">Particulate Matter</h3>
        
        {/* Legend moved down slightly to avoid collision with status badge */}
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: "24px" }}>
          <span style={{ marginRight: 10, fontWeight: 600 }}>Legend:</span>
          <span className="pm-legend">
            <span className="pm-legend-box" style={{ background: "#4ade80", display: "inline-block", width: 8, height: 8, marginRight: 4, borderRadius: "50%" }} /> Good
          </span>
          <span className="pm-legend" style={{ marginLeft: 8 }}>
            <span className="pm-legend-box" style={{ background: "#facc15", display: "inline-block", width: 8, height: 8, marginRight: 4, borderRadius: "50%" }} /> Moderate
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 10 }}>
        <div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>PM1.0</div>
          <div className="aq-pm-value">{pm1} µg/m³</div>
          <div className="aq-pm-tag" style={{ backgroundColor: c1.color }}>{c1.label}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>PM10</div>
          <div className="aq-pm-value">{pm10} µg/m³</div>
          <div className="aq-pm-tag" style={{ backgroundColor: c10.color }}>{c10.label}</div>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "#6b7280" }}>PM2.5</div>
            <div className="aq-pm-value">{pm25} µg/m³</div>
            <div className="aq-pm-tag" style={{ backgroundColor: c25.color }}>{c25.label}</div>
            <div style={{ marginTop: 10 }}>
              <div style={{ height: 12, borderRadius: 999, background: "#e6e9ee", overflow: "hidden" }}>
                <div className="aq-pm-bar-fill" style={{ width: `${width25}%`, background: c25.color, transition: "width 400ms ease", height: "100%" }} />
              </div>
            </div>
          </div>
          
          {/* Comparison bars */}
          <div style={{ width: 120 }}>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Comparison</div>
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 11, color: "#6b7280" }}>PM1</div>
              <div style={{ height: 8, borderRadius: 6, background: "#eef2f7", overflow: "hidden" }}>
                <div style={{ width: `${width1}%`, height: "100%", background: c1.color }} />
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 11, color: "#6b7280" }}>PM10</div>
              <div style={{ height: 8, borderRadius: 6, background: "#eef2f7", overflow: "hidden" }}>
                <div style={{ width: `${width10}%`, height: "100%", background: c10.color }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}