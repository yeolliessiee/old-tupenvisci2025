import React from "react";

export default function PHGauge({ ph }) {
  // Calculate position on pH scale (0-14)
  const percentage = (ph / 14) * 100;
  
  // Determine color based on pH value
  const getColor = (phValue) => {
    if (phValue < 6.0) return "#f44336"; // Red - Acidic
    if (phValue >= 6.0 && phValue < 6.5) return "#ff9800"; // Orange
    if (phValue >= 6.5 && phValue <= 8.5) return "#4caf50"; // Green - Good
    if (phValue > 8.5 && phValue <= 9.0) return "#ff9800"; // Orange
    return "#f44336"; // Red - Alkaline
  };

  const color = getColor(ph);

  return (
    <div className="wq-card wq-gauge-card">
      <h3 className="wq-section-title">pH Scale</h3>
      
      <div className="wq-gauge-container">
        <div className="wq-gauge-scale">
          <div className="wq-scale-bar">
            <div className="wq-scale-gradient"></div>
            <div 
              className="wq-scale-indicator" 
              style={{ 
                left: `${percentage}%`,
                backgroundColor: color 
              }}
            >
              <span className="wq-indicator-value">{ph.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="wq-scale-labels">
            <span>0</span>
            <span>7</span>
            <span>14</span>
          </div>
          
          <div className="wq-scale-markers">
            <span className="wq-marker acidic">Acidic</span>
            <span className="wq-marker neutral">Neutral</span>
            <span className="wq-marker alkaline">Alkaline</span>
          </div>
        </div>

        <div className="wq-quality-status">
          <div className="wq-status-row">
            <span className="wq-status-label">Water Quality:</span>
            <span className="wq-status-badge" style={{ backgroundColor: color }}>
              {ph >= 6.5 && ph <= 8.5 ? "Good" : ph >= 6.0 && ph <= 9.0 ? "Fair" : "Poor"}
            </span>
          </div>
          <div className="wq-status-info">
            Acceptable range: 6.5 - 8.5
          </div>
        </div>
      </div>
    </div>
  );
}