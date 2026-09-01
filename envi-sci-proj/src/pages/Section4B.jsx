import React, { useEffect, useState } from "react";
import "../App.css";

// FIREBASE IMPORTS
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

// WATER QUALITY COMPONENTS
import Sidebar from "../components/wqDashboard/Sidebar";
import Header from "../components/wqDashboard/Header";
import StatCard from "../components/wqDashboard/StatCard";
import TrendChart from "../components/wqDashboard/TrendChart";
import PHGauge from "../components/wqDashboard/PHGauge";

// FIREBASE CONFIGURATION (same as Section C)
const firebaseConfig = {
  apiKey: "AIzaSyCAGDSW6zwtnxTg43wNlHQH_DY7jMurZfo",
  authDomain: "envi-sci-4.firebaseapp.com",
  databaseURL: "https://envi-sci-4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "envi-sci-4",
  storageBucket: "envi-sci-4.firebasestorage.app",
  messagingSenderId: "676824408570",
  appId: "1:676824408570:web:7c95fca9ad8ec8c41d4443",
  measurementId: "G-WWKXWQ7VBR"
};

const app = initializeApp(firebaseConfig, "section4b");
const db = getDatabase(app);

export default function Section4B() {
  const [metrics, setMetrics] = useState({
    ph: 7.0,
    turbidity: 0,
    tds: 0,
    temperature: 0,
    hourly: [
      { time: "06:00", value: 7.0 },
      { time: "07:00", value: 7.0 },
      { time: "08:00", value: 7.0 },
      { time: "09:00", value: 7.0 },
      { time: "10:00", value: 7.0 },
      { time: "11:00", value: 7.0 },
      { time: "12:00", value: 7.0 },
      { time: "13:00", value: 7.0 },
      { time: "14:00", value: 7.0 },
      { time: "15:00", value: 7.0 },
      { time: "16:00", value: 7.0 },
      { time: "17:00", value: 7.0 },
    ],
  });

  useEffect(() => {
    // LISTEN TO CURRENT WATER QUALITY SENSORS
    const waterSensorsRef = ref(db, 'waterSensors');

    const unsubscribe = onValue(
      waterSensorsRef, 
      (snapshot) => {
        const data = snapshot.val();
        
        if (data) {
          console.log("🔥 Firebase Water Data Received:", data);

          setMetrics(prevMetrics => ({
            ...prevMetrics,
            ph: data.ph || 7.0,
            turbidity: data.turbidity || 0,
            tds: data.tds || 0,
            temperature: data.temperature || 0,
          }));
        } else {
          console.log("⚠️ Connected to Firebase, but waterSensors data is null.");
        }
      },
      (error) => {
        console.error("❌ Firebase Error:", error);
      }
    );

    // LISTEN TO HISTORICAL pH DATA
    const today = new Date().toISOString().split('T')[0]; // "2024-12-10"
    const phHistoryRef = ref(db, `phHistory/${today}`);

    const unsubscribeHistory = onValue(
      phHistoryRef,
      (snapshot) => {
        const historyData = snapshot.val();
        
        if (historyData) {
          console.log("📊 pH History Received:", historyData);
          
          // Convert to array format for chart
          const hourlyArray = Object.entries(historyData)
            .map(([time, value]) => ({
              time: time,
              value: value
            }))
            .sort((a, b) => a.time.localeCompare(b.time)) // Sort by time
            .slice(-12); // Get last 12 hours
          
          setMetrics(prevMetrics => ({
            ...prevMetrics,
            hourly: hourlyArray.length > 0 ? hourlyArray : prevMetrics.hourly
          }));
        } else {
          console.log("📊 No pH history data available for today");
        }
      },
      (error) => {
        console.error("❌ Firebase History Error:", error);
      }
    );

    // Cleanup listeners on unmount
    return () => {
      unsubscribe();
      unsubscribeHistory();
    };
  }, []);

  return (
    <div className="wq-root">
      <div className="wq-layout">
        <Sidebar ph={metrics.ph} />

        <div className="wq-main">
          <Header />

          <div className="wq-grid">
            <StatCard
              label="pH Level"
              value={metrics.ph.toFixed(2)}
              sub="Current"
            />
            <StatCard
              label="Turbidity"
              value={`${metrics.turbidity.toFixed(1)} NTU`}
              sub="Clarity"
            />
            <StatCard
              label="TDS"
              value={`${metrics.tds.toFixed(0)} ppm`}
              sub="Dissolved Solids"
            />
            <StatCard
              label="Temperature"
              value={`${metrics.temperature.toFixed(1)} °C`}
              sub="Water Temp"
            />

            <TrendChart data={metrics.hourly} />
            <PHGauge ph={metrics.ph} />
          </div>
        </div>
      </div>
    </div>
  );
}