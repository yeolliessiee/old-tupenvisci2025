import React, { useEffect, useState, useRef } from "react";
import "../App.css"; 
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push, query, limitToLast, remove, orderByChild, endAt, get } from "firebase/database";
import { Trash2, Database, X, Activity } from "lucide-react"; 

import Sidebar from "../components/aqDashboard/Sidebar";
import Header from "../components/aqDashboard/Header";
import TrendChart from "../components/aqDashboard/TrendChart";
import PMGauge from "../components/aqDashboard/PMGauge";

// --- CONFIGURATION ---
const ADMIN_PASSWORD = "TUPenvisci"; // <--- THE PASSWORD

const firebaseConfig = {
  apiKey: "AIzaSyAMidQ4KHYD5qMGCqV8JLr5020uuUb2fnk",
  authDomain: "envi-sci-project.firebaseapp.com",
  databaseURL: "https://envi-sci-project-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "envi-sci-project",
  storageBucket: "envi-sci-project.firebasestorage.app",
  messagingSenderId: "130410569434",
  appId: "1:130410569434:web:b9bdadc2f0d642e0e68fe3"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const ZERO_UI = { temperature: 0, humidity: 0, pressure: 0, pm1: 0, pm25: 0, pm10: 0 };
const NULL_DATA = { temperature: null, humidity: null, pressure: null, pm1: null, pm25: null, pm10: null };

const format = (num) => num ? Number(num).toFixed(1) : 0;
const formatInt = (num) => num ? Number(num).toFixed(0) : 0;

export default function Section4C() {
  const [activeTab, setActiveTab] = useState('overview'); 
  const [timeRange, setTimeRange] = useState('daily');
  
  const [dataFloor1, setDataFloor1] = useState(null);
  const [dataFloor2, setDataFloor2] = useState(null);

  const [statusF1, setStatusF1] = useState(false);
  const [statusF2, setStatusF2] = useState(false);
  
  const [fullHistory, setFullHistory] = useState([]);
  const [chartData, setChartData] = useState([]);

  const [showDataModal, setShowDataModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [isServerMode, setIsServerMode] = useState(false);

  const prevFloor1Str = useRef("");
  const prevFloor2Str = useRef("");
  const lastUpdateF1 = useRef(Date.now()); 
  const lastUpdateF2 = useRef(Date.now());
  const lastSavedTime = useRef(0); 
  const gapRecorded = useRef(false);

  // --- WAKE LOCK ---
  useEffect(() => {
    let wakeLock = null;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen');
          setIsServerMode(true);
          console.log('Wake Lock active');
        }
      } catch (err) { console.log(err); }
    };
    requestWakeLock();
    const handleVisibilityChange = () => { if (document.visibilityState === 'visible') requestWakeLock(); };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      if (wakeLock) wakeLock.release();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // --- SAVE FUNCTION ---
  const saveToHistory = (f1, f2) => {
    const historyRef = ref(db, 'history');
    push(historyRef, {
        timestamp: Date.now(),
        floor1: f1 || {},
        floor2: f2 || {}
    });
  };

  // --- NEW: SECURE DELETE FUNCTION ---
  const deleteHistory = async (rangeType) => {
    // 1. Ask for Password
    const inputPass = window.prompt("🔒 SECURITY CHECK\nEnter Admin Password to delete data:");
    
    // 2. Verify Password
    if (inputPass !== ADMIN_PASSWORD) {
        alert("❌ ACCESS DENIED: Incorrect Password.");
        return; 
    }

    // 3. Confirm Action
    if(!window.confirm("⚠️ FINAL WARNING: Are you sure? This cannot be undone.")) return;
    
    setIsDeleting(true);
    const historyRef = ref(db, 'history');
    const now = Date.now();
    let cutoff = 0;

    if (rangeType === 'last_hour') cutoff = now - (60 * 60 * 1000);
    else if (rangeType === 'last_24h') cutoff = now - (24 * 60 * 60 * 1000);
    else if (rangeType === 'all') cutoff = now;

    if (rangeType === 'all') {
        await remove(historyRef);
    } else {
        const q = query(historyRef, orderByChild('timestamp'), endAt(cutoff));
        const snapshot = await get(q);
        
        if (snapshot.exists()) {
            const updates = {};
            snapshot.forEach((child) => {
                updates[child.key] = null; 
            });
            await ref(db, 'history').update(updates);
        }
    }
    
    setIsDeleting(false);
    setShowDataModal(false);
    alert("✅ Data successfully deleted.");
  };

  // 1. LISTEN TO LIVE SENSORS
  useEffect(() => {
    const sensorsRef = ref(db, 'sensors');
    const unsubscribe = onValue(sensorsRef, (snapshot) => {
      const data = snapshot.val();
      const now = Date.now();

      if (data) {
        let hasChanged = false;

        // FLOOR 1
        if (data.floor1) {
            const str = JSON.stringify(data.floor1);
            setDataFloor1(data.floor1);
            if (prevFloor1Str.current !== str) {
                if (prevFloor1Str.current !== "") {
                    setStatusF1(true); 
                    lastUpdateF1.current = now;
                    gapRecorded.current = false;
                }
                hasChanged = true;
            }
            prevFloor1Str.current = str;
        }

        // FLOOR 2
        if (data.floor2) {
            const str = JSON.stringify(data.floor2);
            setDataFloor2(data.floor2);
            if (prevFloor2Str.current !== str) {
                if (prevFloor2Str.current !== "") {
                    setStatusF2(true); 
                    lastUpdateF2.current = now;
                    gapRecorded.current = false;
                }
                hasChanged = true;
            }
            prevFloor2Str.current = str;
        }

        if (hasChanged && (now - lastSavedTime.current > 60000)) {
            const isF1Offline = (now - lastUpdateF1.current > 15000);
            const isF2Offline = (now - lastUpdateF2.current > 15000);
            const payloadF1 = isF1Offline ? NULL_DATA : data.floor1;
            const payloadF2 = isF2Offline ? NULL_DATA : data.floor2;

            if (!isF1Offline || !isF2Offline) {
                saveToHistory(payloadF1, payloadF2);
                lastSavedTime.current = now;
            }
        }
      }
    });

    const interval = setInterval(() => {
        const now = Date.now();
        const f1Offline = (now - lastUpdateF1.current > 15000);
        const f2Offline = (now - lastUpdateF2.current > 15000);

        if (f1Offline) setStatusF1(false);
        if (f2Offline) setStatusF2(false);

        if ((f1Offline || f2Offline) && !gapRecorded.current) {
            const payloadF1 = f1Offline ? NULL_DATA : (dataFloor1 || NULL_DATA);
            const payloadF2 = f2Offline ? NULL_DATA : (dataFloor2 || NULL_DATA);
            saveToHistory(payloadF1, payloadF2);
            gapRecorded.current = true;
        }
    }, 5000);

    return () => { unsubscribe(); clearInterval(interval); };
  }, [dataFloor1, dataFloor2]); 

  // 2. LOAD HISTORY
  useEffect(() => {
    const historyRef = query(ref(db, 'history'), limitToLast(5000)); 
    const unsubscribeHistory = onValue(historyRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) { setFullHistory([]); return; }
        
        const formatted = Object.values(data).map(entry => ({
            timestamp: entry.timestamp,
            dateObj: new Date(entry.timestamp),
            floor1: entry.floor1,
            floor2: entry.floor2
        }));
        setFullHistory(formatted);
    });
    return () => unsubscribeHistory();
  }, []);

  // 3. METRICS
  const getDisplayMetrics = () => {
    if (!statusF1 && activeTab === 'floor1') return ZERO_UI;
    if (!statusF2 && activeTab === 'floor2') return ZERO_UI;
    if (!statusF1 && !statusF2 && activeTab === 'overview') return ZERO_UI;
    if (activeTab === 'floor1') return dataFloor1 || ZERO_UI;
    if (activeTab === 'floor2') return dataFloor2 || ZERO_UI;
    if (dataFloor1 && dataFloor2) {
        return {
            temperature: ((parseFloat(dataFloor1.temperature) + parseFloat(dataFloor2.temperature)) / 2).toFixed(1),
            humidity: ((parseFloat(dataFloor1.humidity) + parseFloat(dataFloor2.humidity)) / 2).toFixed(0),
            pressure: ((parseFloat(dataFloor1.pressure) + parseFloat(dataFloor2.pressure)) / 2).toFixed(0),
            pm1: Math.ceil((dataFloor1.pm1 + dataFloor2.pm1) / 2),
            pm25: Math.ceil((dataFloor1.pm25 + dataFloor2.pm25) / 2),
            pm10: Math.ceil((dataFloor1.pm10 + dataFloor2.pm10) / 2),
        };
    }
    return dataFloor1 || dataFloor2 || ZERO_UI;
  };

  const currentMetrics = getDisplayMetrics();
  const isViewLive = activeTab === 'floor1' ? statusF1 : activeTab === 'floor2' ? statusF2 : (statusF1 || statusF2);

  // 4. CHART DATA
  useEffect(() => {
    if (fullHistory.length === 0) { setChartData([]); return; }
    const now = new Date();
    let cutoffTime = new Date();
    
    if (timeRange === 'daily') cutoffTime.setHours(now.getHours() - 24);
    if (timeRange === 'weekly') cutoffTime.setDate(now.getDate() - 7);
    if (timeRange === 'monthly') cutoffTime.setMonth(now.getMonth() - 1);
    if (timeRange === 'yearly') cutoffTime.setFullYear(now.getFullYear() - 1);

    const filtered = fullHistory.filter(item => item.dateObj >= cutoffTime);

    const mappedData = filtered.map(item => {
        let metrics = { temp: null, humidity: null, pressure: null, pm1: null, pm25: null, pm10: null };
        const f1 = item.floor1; 
        const f2 = item.floor2;
        const isValid = (v) => v !== null && v !== undefined && !isNaN(v);

        if (activeTab === 'floor1' && f1 && isValid(f1.temperature)) {
            metrics = { temp: parseFloat(f1.temperature), humidity: parseFloat(f1.humidity), pressure: parseFloat(f1.pressure), pm1: parseFloat(f1.pm1), pm25: parseFloat(f1.pm25), pm10: parseFloat(f1.pm10) };
        } else if (activeTab === 'floor2' && f2 && isValid(f2.temperature)) {
             metrics = { temp: parseFloat(f2.temperature), humidity: parseFloat(f2.humidity), pressure: parseFloat(f2.pressure), pm1: parseFloat(f2.pm1), pm25: parseFloat(f2.pm25), pm10: parseFloat(f2.pm10) };
        } else if (activeTab === 'overview') {
             if (f1 && isValid(f1.temperature) && f2 && isValid(f2.temperature)) {
                 metrics = { temp: (parseFloat(f1.temperature) + parseFloat(f2.temperature)) / 2, humidity: (parseFloat(f1.humidity) + parseFloat(f2.humidity)) / 2, pressure: (parseFloat(f1.pressure) + parseFloat(f2.pressure)) / 2, pm1: (parseFloat(f1.pm1) + parseFloat(f2.pm1)) / 2, pm25: (parseFloat(f1.pm25) + parseFloat(f2.pm25)) / 2, pm10: (parseFloat(f1.pm10) + parseFloat(f2.pm10)) / 2 };
             } else if (f1 && isValid(f1.temperature)) {
                 metrics = { temp: parseFloat(f1.temperature), humidity: parseFloat(f1.humidity), pressure: parseFloat(f1.pressure), pm1: parseFloat(f1.pm1), pm25: parseFloat(f1.pm25), pm10: parseFloat(f1.pm10) };
             } else if (f2 && isValid(f2.temperature)) {
                 metrics = { temp: parseFloat(f2.temperature), humidity: parseFloat(f2.humidity), pressure: parseFloat(f2.pressure), pm1: parseFloat(f2.pm1), pm25: parseFloat(f2.pm25), pm10: parseFloat(f2.pm10) };
             }
        }

        let label = "";
        const d = item.dateObj;
        if (timeRange === 'daily') label = `${d.getHours()}:${d.getMinutes().toString().padStart(2,'0')}`;
        else if (timeRange === 'weekly') label = d.toLocaleDateString('en-US', { weekday: 'short' });
        else if (timeRange === 'monthly') label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        else if (timeRange === 'yearly') label = d.toLocaleDateString('en-US', { month: 'short' });

        return { label, ...metrics };
    });
    setChartData(mappedData);
  }, [fullHistory, timeRange, activeTab]);

  // 5. CSV DOWNLOAD
  const handleDownload = () => {
    if (!fullHistory.length) return;
    const now = new Date();
    let filteredData = [];
    let fileName = "";
    const dateStr = now.toISOString().split('T')[0]; 

    if (timeRange === 'daily') {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        filteredData = fullHistory.filter(d => d.dateObj >= startOfDay);
        fileName = `Daily-Report_${dateStr}_SmartAirTUP.csv`;
    } 
    else if (timeRange === 'weekly') {
        const day = now.getDay(); 
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - day);
        startOfWeek.setHours(0,0,0,0);
        filteredData = fullHistory.filter(d => d.dateObj >= startOfWeek);
        fileName = `Weekly-Report_${dateStr}_SmartAirTUP.csv`;
    }
    else if (timeRange === 'monthly') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        filteredData = fullHistory.filter(d => d.dateObj >= startOfMonth);
        fileName = `Monthly-Report_${dateStr}_SmartAirTUP.csv`;
    }
    else {
        filteredData = fullHistory;
        fileName = `Full-Report_${dateStr}_SmartAirTUP.csv`;
    }

    if (filteredData.length === 0) { alert("No data available."); return; }

    const headers = ["Date", "Time", "Day", "Temperature (C)", "Humidity (%)", "Pressure (hPa)", "PM1.0", "PM2.5", "PM10"];
    const rows = filteredData.map(item => {
        const d = item.dateObj;
        const datePart = d.toISOString().split('T')[0]; 
        const timePart = d.toLocaleTimeString([], { hour12: false });
        const dayPart = d.toLocaleDateString('en-US', { weekday: 'long' });

        let t="", h="", p="", pm1="", pm25="", pm10="";
        const f1 = item.floor1 || {};
        const f2 = item.floor2 || {};
        const hasF1 = f1.temperature !== undefined;
        const hasF2 = f2.temperature !== undefined;

        if (activeTab === 'floor1' && hasF1) { t=f1.temperature; h=f1.humidity; p=f1.pressure; pm1=f1.pm1; pm25=f1.pm25; pm10=f1.pm10; }
        else if (activeTab === 'floor2' && hasF2) { t=f2.temperature; h=f2.humidity; p=f2.pressure; pm1=f2.pm1; pm25=f2.pm25; pm10=f2.pm10; }
        else if (activeTab === 'overview' && (hasF1 || hasF2)) {
             if (hasF1 && hasF2) { t=(parseFloat(f1.temperature)+parseFloat(f2.temperature))/2; h=(parseFloat(f1.humidity)+parseFloat(f2.humidity))/2; p=(parseFloat(f1.pressure)+parseFloat(f2.pressure))/2; pm1=(parseFloat(f1.pm1)+parseFloat(f2.pm1))/2; pm25=(parseFloat(f1.pm25)+parseFloat(f2.pm25))/2; pm10=(parseFloat(f1.pm10)+parseFloat(f2.pm10))/2; }
             else if (hasF1) { t=f1.temperature; h=f1.humidity; p=f1.pressure; pm1=f1.pm1; pm25=f1.pm25; pm10=f1.pm10; }
             else { t=f2.temperature; h=f2.humidity; p=f2.pressure; pm1=f2.pm1; pm25=f2.pm25; pm10=f2.pm10; }
        }
        const fmt = (val) => val === "" || val === undefined || val === null ? "" : Number(val).toFixed(2);
        return [datePart, timePart, dayPart, fmt(t), fmt(h), fmt(p), fmt(pm1), fmt(pm25), fmt(pm10)].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="section4c-root" >
      <div className="aq-root">
        <div className="aq-layout">
          <Sidebar temperature={format(currentMetrics.temperature)} onDownload={handleDownload} />
          <div className="aq-main">
            <Header connected={isViewLive} />
            <div className="floor-tabs-container">
                <button className={`floor-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
                <button className={`floor-tab ${activeTab === 'floor1' ? 'active' : ''}`} onClick={() => setActiveTab('floor1')}><span className={`dot ${statusF1 ? 'on' : 'off'}`}></span> Floor 1</button>
                <button className={`floor-tab ${activeTab === 'floor2' ? 'active' : ''}`} onClick={() => setActiveTab('floor2')}><span className={`dot ${statusF2 ? 'on' : 'off'}`}></span> Floor 2</button>
            </div>
            
            <div className="aq-grid">
              <div className="aq-card" style={{ gridColumn: "1 / -1" }}>
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", paddingBottom: "10px", borderBottom: "1px solid #f3f4f6" }}>
                    <h3 className="aq-section-title" style={{ margin: 0, fontSize: "15px" }}>Environmental Sensor</h3>
                    <div className={`status-pill ${isViewLive ? 'online' : 'offline'}`} style={{ fontSize: "10px", padding: "2px 8px", marginLeft: "10px" }}>
                        {isViewLive ? (<><div style={{ width: 6, height: 6, borderRadius: "50%", background: "#166534" }}></div><span>ACTIVE</span></>) : (<><div style={{ width: 6, height: 6, borderRadius: "50%", background: "#991b1b" }}></div><span>OFFLINE</span></>)}
                    </div>
                 </div>
                 <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
                    <div style={{ flex: "1 1 100px" }}> 
                       <div className="aq-card-top"><span className="aq-card-label">Temperature</span><span className="aq-card-sub">Current</span></div>
                       <div className="aq-card-value">{format(currentMetrics.temperature)} °C</div>
                    </div>
                    <div className="divider-vertical" style={{ width: "1px", background: "#f3f4f6" }}></div>
                    <div style={{ flex: "1 1 100px" }}>
                        <div className="aq-card-top"><span className="aq-card-label">Humidity</span><span className="aq-card-sub">Relative</span></div>
                       <div className="aq-card-value">{formatInt(currentMetrics.humidity)} %</div>
                    </div>
                    <div className="divider-vertical" style={{ width: "1px", background: "#f3f4f6" }}></div>
                    <div style={{ flex: "1 1 100px" }}>
                        <div className="aq-card-top"><span className="aq-card-label">Pressure</span><span className="aq-card-sub">Atmospheric</span></div>
                       <div className="aq-card-value">{formatInt(currentMetrics.pressure)} hPa</div>
                    </div>
                 </div>
              </div>

              {/* --- TREND CHART --- */}
              <div className="aq-card aq-chart-card">
                  <div style={{ position: 'relative' }}>
                        <TrendChart 
                            data={chartData} 
                            timeRange={timeRange} 
                            onTimeRangeChange={setTimeRange}
                            onDownload={handleDownload}
                        />
                        {isServerMode && (
                            <div style={{ position: 'absolute', top: '22px', right: '100px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#166534', background: '#dcfce7', padding: '4px 8px', borderRadius: '12px' }}>
                                <Activity size={12} className="pulse-icon" /> REC
                            </div>
                        )}
                        <button 
                            onClick={() => setShowDataModal(true)}
                            className="download-btn"
                            style={{ position: 'absolute', top: '20px', right: '55px', zIndex: 10 }}
                            title="Manage Data"
                        >
                            <Database size={18} />
                        </button>
                  </div>
              </div>
              
              <PMGauge 
                pm1={currentMetrics.pm1} 
                pm25={currentMetrics.pm25} 
                pm10={currentMetrics.pm10} 
                isActive={isViewLive}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- DATA MANAGEMENT MODAL --- */}
      {showDataModal && (
        <div className="modal-overlay" style={{zIndex: 9999}}>
            <div className="modal-box" style={{ maxWidth: '400px', padding: '20px', background: 'white', color: '#333' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><Database size={20}/> Storage Management</h3>
                    <button 
                        onClick={() => setShowDataModal(false)} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333' }}
                    >
                        <X size={24} />
                    </button>
                </div>
                
                <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#666' }}>Current Capacity Usage</p>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2e7d32' }}>{fullHistory.length} <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#666' }}>records</span></div>
                    <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: '#999' }}>~{(fullHistory.length * 0.0002).toFixed(2)} MB estimated</p>
                </div>

                <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>Delete History Data (Requires Password)</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button 
                        disabled={isDeleting}
                        onClick={() => deleteHistory('last_hour')}
                        style={{ padding: '10px', background: '#fff', border: '1px solid #fee2e2', borderRadius: '6px', color: '#b91c1c', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                        <Trash2 size={16}/> Clear Last 1 Hour
                    </button>
                    <button 
                        disabled={isDeleting}
                        onClick={() => deleteHistory('last_24h')}
                        style={{ padding: '10px', background: '#fff', border: '1px solid #fee2e2', borderRadius: '6px', color: '#b91c1c', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                        <Trash2 size={16}/> Clear Last 24 Hours
                    </button>
                    <button 
                        disabled={isDeleting}
                        onClick={() => deleteHistory('all')}
                        style={{ padding: '10px', background: '#fee2e2', border: 'none', borderRadius: '6px', color: '#991b1b', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                        <Trash2 size={16}/> Clear ALL History
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}