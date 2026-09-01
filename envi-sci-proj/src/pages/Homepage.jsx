import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; 

// --- 1. STATIC DATA WITH DAY/NIGHT LOGIC ---

const teamData4C = [

  {
    name: "ALLAUIGAN, Maria Dianne Alexa R.",
    role: "Researcher",
    desc: "Specializes in data validation methodologies and compiles critical environmental impact reports for the team.",
    gender: "female",
    imgDay: "/Envi Baddie Pics/DAY/Allauigan.png",
  },
  {
    name: "BALDICANO, Kelly E.",
    role: "Lead Software Developer",
    desc: "Bridges the gap between hardware data streams and the web application via API integration and cloud connectivity.",
    gender: "male",
    imgDay: "/Envi Baddie Pics/DAY/Baldicano.jpg"
  },
  {
    name: "BERMUDEZ, Charles Matthew D.",
    role: "Researhcer",
    desc: "Specializes in data validation methodologies and compiles critical environmental impact reports for the team.",
    gender: "male",
    imgDay: "/Envi Baddie Pics/DAY/BERMUDEZ_CHARLES_MATTHEW.jpg"
  },
  {
    name: "BONCAYAO, Dave Joshua D.",
    role: "Hardware Support",
    desc: "Provides essential support in building the hardware foundation, assisting with assembly and testing.",
    gender: "male"
  },
  {
    name: "CALIXTRO, Carlito",
    role: "Hardware Support",
    desc: "Assists the core hardware team by assembling components and reinforcing the physical structure of the device.",
    gender: "male"
  },
  {
    name: "CATAYTAY, Algean",
    role: "IoT & Procurement",
    desc: "Manages component procurement and codes the ESP32 modules to ensure seamless wireless communication.",
    gender: "male",
    imgDay: "/Envi Baddie Pics/DAY/Cataytay.jpg"
  },
  {
    name: "DULOT, William Maurice C.",
    role: "Firmware Engineer",
    desc: "Focuses on firmware development, writing and optimizing the code logic for the ESP32 microcontrollers.",
    gender: "male"
  },
  {
    name: "FUERTES, David Israel J.",
    role: "Frontend Developer",
    desc: "Develops the core visualization logic, optimizing chart performance and real-time data rendering on the web platform.",
    gender: "male",
    imgDay: "/Envi Baddie Pics/DAY/Fuertes.jpg"
  },
  {
    name: "LISONDRA, Mike Jay-R B.",
    role: "Backend Developer",
    desc: "Manages the database infrastructure and server-side logic to ensure secure and efficient storage of sensor data.",
    gender: "male",
    imgDay: "/Envi Baddie Pics/DAY/LISONDRA.jpg"
  },
  {
    name: "LOPEZ, Harold B.",
    role: "Hardware Support",
    desc: "Supports the circuit and wiring implementation, helping build upon the main hardware foundations.",
    gender: "male"
  },
  {
    name: "OCHAVILLO, Gladys A.",
    role: "Lead Researcher",
    desc: "Conducts in-depth studies on environmental parameters and ensures the project aligns with scientific air quality standards.",
    gender: "female",
    imgDay: "/Envi Baddie Pics/DAY/OCHAVILLO.jpg"
  },
  {
    name: "SANCHEZ, Daniel Roman B.",
    role: "Chassis Designer",
    desc: "Specializes in 3D printing and structural design, creating the custom chassis to house and protect the hardware.",
    gender: "male",
    imgDay: "/Envi Baddie Pics/DAY/SANCHEZ.png"
  },
  {
    name: "SIQUIJOR, Lloyd",
    role: "Hardware Support",
    desc: "Contributes to the hardware assembly and testing processes to ensure the stability of the physical units.",
    gender: "male"
  },
  {
    name: "SOMCIO, Justin Nathan Luis M.",
    role: "UI/UX Engineer",
    desc: "Architects the frontend user interface, ensuring a responsive, accessible, and intuitive dashboard experience for users.",
    gender: "male",
    imgDay: "/Envi Baddie Pics/DAY/Somcio sa umaga.jpg",
    imgNight: "/Envi Baddie Pics/NIGHT/Somcio sa gabi.png"
  },
  {
    name: "TORRES, Abhrei Mikael D.",
    role: "Researcher",
    desc: "Specializes in data validation methodologies and compiles critical environmental impact reports for the team.",
    gender: "male",
    imgDay: "/Envi Baddie Pics/DAY/TORRES.jpg"
  }
];

// --- 2. STATIC DATA FOR SECTION 4B (NEW) ---

const teamData4B = [

  { name: "ALBAÑO, NEIL ERWIN SARMIENTO", role: "Wiring/Circuit/Components", gender: "male", imgDay: "", desc: "" },

  { name: "ALZAGA, CHRISTIAN RANIN", role: "Paper", gender: "male", imgDay: "/Envi 4B/Alzaga.png", desc: "" },

  { name: "ARCILLA, ADRIAN GABRIEL BONZON", role: "Wiring/Circuit/Components", gender: "male", imgDay: "", desc: "" },

  { name: "BAISAC, JOVELYN MELCA", role: "Member", gender: "female", imgDay: "", desc: "" },

  { name: "BAUTISTA, JOHN VENTURES", role: "Assembly", gender: "male", imgDay: "", desc: "" },

  { name: "BELGA , CHANDA ALTHEA MENDOZA", role: "Prototype Coding", gender: "female", imgDay: "/Envi 4B/Belga.jpg", desc: "" },

  { name: "BUITIZON, JANEL ALIS", role: "Website", gender: "female", imgDay: "/Envi 4B/buitizon.jpg", desc: "" },

  { name: "DUTING, JOHN ALDHON UMALI", role: "Prototype Coding", gender: "male", imgDay: "/Envi 4B/Duting.jpg", desc: "" },

  { name: "GUILLERMO, DANIELA DELA YOLA", role: "Paper", gender: "female", imgDay: "/Envi 4B/Guillermo.jpg", desc: "" },

  { name: "MALLARE, THOM MICKEL MACABALLUG", role: "Assembly", gender: "male", imgDay: "/Envi 4B/Mallare.jpg", desc: "" },

  { name: "MANZANO, DJ MASIRAG", role: "Assembly", gender: "male", imgDay: "/Envi 4B/Manzano.jpg", desc: "" },

  { name: "NG, PRINCESS CYANIA TERRENAL", role: "Prototype Coding", gender: "female", imgDay: "/Envi 4B/Ng.png", desc: "" },

  { name: "PABLO, JHERIC VINCENT MAIGTING", role: "Website", gender: "male", imgDay: "/Envi 4B/Pablo.jpg", desc: "" },

  { name: "PASIONA, RENIELLE COPADA", role: "Assembly", gender: "female", imgDay: "/Envi 4B/Pasiona.jpg", desc: "" }

];

// Helper to format names safely
const processName = (rawName) => {
  if (!rawName.includes(',')) return rawName; 
  const parts = rawName.split(',');
  const firstName = parts[1] ? parts[1].trim().split(' ')[0] : '';
  return `${parts[0]} ${firstName}`;
};

const Home = () => {
  const { theme } = useTheme(); 
  
  const [activeSection, setActiveSection] = useState('4C');
  const [clickedHero, setClickedHero] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(2); 
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  // --- HELPER FUNCTION TO MAP MEMBERS WITH THEME LOGIC ---
  const mapMembers = (dataList, colorCode) => {
    return dataList.map((p, index) => {
      let finalImage = null;

      if (theme === 'dark') {
        // NIGHT MODE LOGIC
        if (p.imgNight) {
          finalImage = p.imgNight; // Use specific night image if available
        } else {
          // If no night image, FALLBACK to Day image (don't use General Boy/Girl)
          finalImage = p.imgDay || null;
        }
      } else {
        // DAY MODE LOGIC
        finalImage = p.imgDay || null;
      }

      // Check section ID to generate correct ID prefix
      const idPrefix = colorCode === '#e3f2fd' ? '4c' : '4b';

      return { 
        id: `${idPrefix}-${index}`, 
        name: processName(p.name), 
        fullName: p.name, 
        role: p.role, 
        desc: p.desc, 
        img: finalImage,
        color: colorCode 
      };
    });
  };

  // --- PREPARE MEMBER LISTS ---
  const members4C = mapMembers(teamData4C, '#e3f2fd');
  const members4B = mapMembers(teamData4B, '#e8f5e9'); // Using new 4B Data
  
  const currentMembers = activeSection === '4C' ? members4C : members4B;
  const focusedMember = currentMembers[focusedIndex];
  const buttonText = focusedMember ? focusedMember.name.split(' ')[0] : '...';

  // --- SCROLL LOGIC ---
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const handleScroll = () => {
      const center = container.scrollLeft + container.offsetWidth / 2;
      const cardWidth = 260; 
      let newIndex = Math.round((center - container.offsetWidth / 2) / cardWidth);
      newIndex = Math.max(0, Math.min(newIndex, currentMembers.length - 1));
      setFocusedIndex(newIndex);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial centering
    setTimeout(() => {
      const cardWidth = 260;
      if (container) container.scrollLeft = focusedIndex * cardWidth;
    }, 100);

    return () => container.removeEventListener('scroll', handleScroll);
  }, [activeSection, currentMembers.length]); 

  // --- HANDLERS ---
  const handleHeroClick = (side, path) => {
    setClickedHero(side);
    setTimeout(() => {
      if (path) navigate(path);
      else setClickedHero(null);
    }, 800);
  };

  const handleSelectMember = (member) => {
    setSelectedMember(member);
    document.body.style.overflow = 'hidden'; 
  };

  const closeModal = () => {
    setSelectedMember(null);
    document.body.style.overflow = 'auto'; 
  };

  const scrollCarousel = (direction) => {
    const container = carouselRef.current;
    if (container) {
      const cardWidth = 260; 
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">

      <header className={`hero-section full-screen ${clickedHero ? 'animating' : ''}`}>
        <div className={`hero-split left ${clickedHero === 'water' ? 'active' : ''}`} onClick={() => handleHeroClick('water', '/section4b')}>
          <div className="image-container"><img src="/water-monitoring.jpg" alt="Water Monitoring" /></div>
          <div className="split-label"><h2>E-NOM</h2><p>Section 4B</p></div>
        </div>
        <div className={`hero-split right ${clickedHero === 'air' ? 'active' : ''}`} onClick={() => handleHeroClick('air', '/section4c')}>
          <div className="image-container"><img src="/air-monitoring.webp" alt="Air Monitoring" /></div>
          <div className="split-label"><h2>Smart Air TUP</h2><p>Go to Dashboard (4C)</p></div>
        </div>
      </header>

      <main className="main-content">
        <div className="about-section">
          <h2 className="about-title">About Us</h2>
          <div className="about-content">
            <div className="about-logo-container">
              <div className="placeholder-logo">
                <img 
                  src="/no-bg.png"  
                  alt="Envi-Sci Logo" 
                  className="about-logo-img" 
                />
              </div>
            </div>
            <div className="about-text">
              <p>This is a collaboration project for <strong>Section 4B</strong> and <strong>Section 4C</strong> for the subject <em>Environmental Science</em>.</p>
              <p>
                <strong>Section 4B</strong> focuses on <strong>E-Nom</strong> (Embedded Network On-site Monitor for Multivariable Output) which monitors Water Quality, while <strong>Section 4C</strong> focuses on <strong>SmartAirTUP</strong> for Air Quality Monitoring.
              </p>
              <div className="supervisor-box"><span className="label">Supervised by:</span><span className="name">Doc. Luna Dela Cruz</span></div>
            </div>
          </div>
        </div>

        <div className="teams-section">
          <div className="teams-header">
            <h2 className="section-title">Meet Our Team Members</h2>
            <p className="section-subtitle">Use arrows to choose, then click Select to check the details.</p>
          </div>

          <div className="team-controls">
            <button className={`toggle-btn ${activeSection === '4C' ? 'active' : ''}`} onClick={() => { setActiveSection('4C'); setFocusedIndex(2); }}>Section 4C </button>
            <button className={`toggle-btn ${activeSection === '4B' ? 'active' : ''}`} onClick={() => { setActiveSection('4B'); setFocusedIndex(2); }}>Section 4B </button>
          </div>

          <div className="carousel-wrapper">
            <button className="nav-arrow left" onClick={() => scrollCarousel('left')}><ChevronLeft size={40} /></button>
            
            <div className="carousel-container" ref={carouselRef}>
              {currentMembers.map((member, index) => {
                let cardClass = 'char-carousel-card';
                if (index === focusedIndex) cardClass += ' center';
                else if (Math.abs(index - focusedIndex) <= 2) cardClass += ' side';
                else cardClass += ' hidden-side';

                return (
                  <div key={member.id} className="char-carousel-item">
                    <div className={cardClass} onClick={() => {
                        setFocusedIndex(index);
                        const container = carouselRef.current;
                        if(container) container.scrollLeft = index * 260;
                    }}>
                      <div className="char-photo-half" style={{ backgroundColor: member.color, overflow: 'hidden' }}>
                        {member.img ? (
                          <img 
                            src={member.img} 
                            alt={member.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        ) : (
                          <span style={{fontSize: '3rem', opacity: 0.5}}>👤</span>
                        )}
                      </div>
                      <div className="char-info-half">
                        <h3 className="char-name">{member.name}</h3>
                        <span className="char-role">{member.role}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button className="nav-arrow right" onClick={() => scrollCarousel('right')}><ChevronRight size={40} /></button>
            <div className="carousel-fade fade-left"></div>
            <div className="carousel-fade fade-right"></div>
          </div>

          <div className="main-select-container">
            <button 
              className="main-select-btn" 
              onClick={() => focusedMember && handleSelectMember(focusedMember)}
              disabled={!focusedMember}
            >
              SELECT {buttonText}
            </button>
          </div>
        </div>
      </main>
      
      <footer className="footer">
        <p>© 2025 Envi-Sci Project. Real-time Monitoring.</p>
      </footer>

      {/* --- POPUP MODAL --- */}
      {selectedMember && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              &times;
            </button>
            <div className="modal-content">
              <div className="modal-photo" style={{ backgroundColor: selectedMember.color, overflow: 'hidden', padding: 0 }}>
                {selectedMember.img ? (
                   <img 
                   src={selectedMember.img} 
                   alt={selectedMember.fullName} 
                   style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                 />
                ) : (
                  <span style={{fontSize: '5rem', opacity: 0.5}}>👤</span>
                )}
              </div>
              <div className="modal-details">
                <h2 className="modal-name">{selectedMember.fullName}</h2>
                <span className="modal-rolebox">{selectedMember.role}</span>
                <div className="modal-desc-scroll">
                  <p>{selectedMember.desc}</p>
                  <p style={{marginTop:'1rem', fontStyle:'italic', color:'#666'}}>
                    Section: {selectedMember.id.startsWith('4c') ? '4C (Smart Air TUP)' : '4B (Water Monitoring)'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;