import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function TrendChart({ data }) {
  const labels = data.map((d) => d.time || "");
  const values = data.map((d) => d.value || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: "pH Level",
        data: values,
        borderColor: "#2196f3",
        backgroundColor: "rgba(33,150,243,0.12)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { 
        beginAtZero: false,
        min: 0,
        max: 14,
        ticks: {
          stepSize: 2
        }
      },
      x: { ticks: { maxTicksLimit: 8 } },
    },
  };

  return (
    <div className="wq-card wq-chart-card">
      <h3 className="wq-section-title">pH Trend (Hourly)</h3>
      <div className="wq-chart-wrapper">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}