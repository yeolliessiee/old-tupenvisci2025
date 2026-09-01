import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronUp, Moon, Sun } from "lucide-react"; 
import { useTheme } from "../context/ThemeContext"; 

export default function Navbar({ brand = "Envi-Sci" }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  
  const { theme, toggleTheme } = useTheme(); 
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(false);
    setDashboardOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      <header className={`main-navbar ${scrolled ? "nav-scrolled" : ""}`} role="banner">
        <div className="nav-left" onClick={() => navigate("/")}>
          <div className="nav-logo">{brand}</div>
        </div>

        <nav className="nav-center">
            <Link to="/" className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>Home</Link>
            <Link to="/section4b" className={`nav-item ${location.pathname === "/section4b" ? "active" : ""}`}>E-NOM</Link>
            <Link to="/section4c" className={`nav-item ${location.pathname === "/section4c" ? "active" : ""}`}>Smart Air TUP</Link>
        </nav>

        <div className="nav-right">
          {/* --- DARK MODE TOGGLE --- */}
          <button onClick={toggleTheme} className="theme-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}>
            {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
          </button>

          <button
            className="nav-hamburger"
            onClick={() => setOpen((s) => !s)}
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <aside className={`mobile-menu ${open ? "open" : ""}`}>
        <div className="mobile-links">
          <Link to="/" className={`mobile-link ${location.pathname === "/" ? "active" : ""}`}>Home</Link>
        </div>

        <div style={{ marginTop: 20 }}>
          <button 
            className="main-select-btn" 
            style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            onClick={() => setDashboardOpen(!dashboardOpen)}
          >
            Open Dashboard
            {dashboardOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {dashboardOpen && (
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '10px', borderLeft: '3px solid #eee' }}>
                <button className="main-select-btn" style={{ background: '#e8f5e9', color: '#1b7a2f', border: '1px solid #1b7a2f', width: '100%', textAlign: 'left' }} onClick={() => handleNavigate("/section4b")}>
                    💧 E-NOM (Water Monitoring)
                </button>
                <button className="main-select-btn" style={{ background: '#e3f2fd', color: '#0288d1', border: '1px solid #0288d1', width: '100%', textAlign: 'left' }} onClick={() => handleNavigate("/section4c")}>
                    💨 Smart Air TUP (Air Monitoring)
                </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}