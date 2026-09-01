// src/components/aqDashboard/Header.jsx
import React from "react";
import { Wifi, WifiOff } from "lucide-react"; // Make sure to install lucide-react if needed

export default function Header({ connected }) {
  return (
    <header className="aq-header">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 className="aq-header-title">Air Quality Monitoring Dashboard</h2>
          
          {/* CONNECTION STATUS PILL */}
          <div className={`status-pill ${connected ? 'online' : 'offline'}`}>
            {connected ? (
              <>
                <Wifi size={14} strokeWidth={3} />
                <span>ONLINE</span>
              </>
            ) : (
              <>
                <WifiOff size={14} strokeWidth={3} />
                <span>OFFLINE</span>
              </>
            )}
          </div>
        </div>
        
        <p className="aq-header-subtitle">
          Here is today&apos;s air quality information.
        </p>
      </div>
    </header>
  );
}