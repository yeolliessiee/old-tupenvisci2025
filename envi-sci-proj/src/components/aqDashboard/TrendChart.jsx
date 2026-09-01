import React, { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import { Download } from "lucide-react"; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom'; 

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, zoomPlugin);

export default function TrendChart({ data = [], timeRange, onTimeRangeChange, onDownload }) {
  const [metric, setMetric] = useState("temp");

  const chartDataPoints = useMemo(() => {
    return data.map((d) => ({
      label: d.label,
      // CRITICAL: Return null for missing data to create a GAP
      value: (d[metric] === null || d[metric] === undefined) ? null : d[metric],
    }));
  }, [data, metric]);

  const metricConfig = {
    temp: { label: "Temperature (°C)", color: "#4f9dff", bg: "rgba(79,157,255,0.12)" },
    humidity: { label: "Humidity (%)", color: "#60a5fa", bg: "rgba(96,165,250,0.08)" },
    pressure: { label: "Pressure (hPa)", color: "#34d399", bg: "rgba(52,211,153,0.06)" },
    pm1: { label: "PM1.0 (µg/m³)", color: "#10b981", bg: "rgba(16, 185, 129, 0.12)" },
    pm25: { label: "PM2.5 (µg/m³)", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.12)" },
    pm10: { label: "PM10 (µg/m³)", color: "#ef4444", bg: "rgba(239, 68, 68, 0.12)" },
  };

  const cfg = metricConfig[metric] || metricConfig.temp;

  const chartData = {
    labels: chartDataPoints.map(d => d.label),
    datasets: [
      {
        label: cfg.label,
        data: chartDataPoints.map(d => d.value),
        borderColor: cfg.color,
        backgroundColor: cfg.bg,
        borderWidth: 2,
        tension: 0.2, // Lower tension for slightly straighter lines
        fill: true,
        pointRadius: 0, // Hide points for cleaner look (show on hover)
        pointHoverRadius: 6,
        spanGaps: false, // <--- IMPORTANT: This creates the visual GAP
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
        legend: { display: false }, 
        tooltip: { mode: "index", intersect: false },
        zoom: {
            pan: {
                enabled: true,
                mode: 'x', // Allow panning left/right
            },
            zoom: {
                wheel: {
                    enabled: true, // Scroll to zoom
                },
                pinch: {
                    enabled: true, // Pinch to zoom (touch)
                },
                mode: 'x', // Only zoom time axis
            }
        }
    },
    interaction: { mode: "nearest", axis: "x", intersect: false },
    scales: {
      x: { 
          grid: { display: false }, // Cleaner look
          ticks: { 
              maxTicksLimit: 8, // Limit labels so they don't overlap
              maxRotation: 0 
          } 
      },
      y: { 
          grid: { color: "#f3f4f6" }, 
          beginAtZero: false 
      },
    },
  };

  return (
    <div className="aq-card aq-chart-card">
      <div className="aq-chart-header">
        <div>
            <h3 className="aq-section-title" style={{marginBottom:0, whiteSpace:'nowrap'}}>Trends</h3>
            <div className="time-range-group">
                {['daily', 'weekly', 'monthly', 'yearly'].map((range) => (
                    <button
                        key={range}
                        className={`range-btn ${timeRange === range ? 'active' : ''}`}
                        onClick={() => onTimeRangeChange(range)}
                    >
                        {range.charAt(0).toUpperCase() + range.slice(1)}
                    </button>
                ))}
            </div>
        </div>

        <div className="metric-actions">
            <div className="metric-group">
            {['temp', 'humidity', 'pressure', 'pm1', 'pm25', 'pm10'].map((m) => (
                <button
                key={m}
                className={`metric-btn ${metric === m ? "active" : ""}`}
                onClick={() => setMetric(m)}
                >
                {m.toUpperCase().replace('PM25', 'PM2.5')}
                </button>
            ))}
            </div>

            <button className="download-btn" onClick={onDownload} title="Download CSV">
                <Download size={18} />
            </button>
        </div>
      </div>

      <div className="aq-chart-wrapper">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}