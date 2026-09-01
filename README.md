🌿 Envi-Sci Monitoring Project (Sections 4B & 4C)

Real-time Environmental Monitoring Dashboard

This is a collaborative web application developed by the students of Section 4B (Water Quality) and Section 4C (Air Quality) for the subject Environmental Science. The platform visualizes real-time sensor data from ESP32 microcontrollers to monitor air and water quality parameters in Manila.

📖 Table of Contents

Project Overview

Features

Tech Stack

Getting Started

Installation & Setup

Project Structure

Configuration (Firebase)

Contribution Guide

Future Roadmap

Team & Credits

<a name="project-overview"></a>🌍 Project Overview

The goal of this project is to provide an accessible, user-friendly interface for monitoring environmental data.

Section 4C (Smart Air TUP): Monitors Air Quality Index (AQI), PM1.0, PM2.5, PM10, Temperature, Humidity, and Atmospheric Pressure.

Section 4B (Water Monitoring): [In Development] Intended to monitor pH levels, Turbidity, and Dissolved Oxygen.

The system uses IoT devices to push data to a cloud database (Firebase), which is then fetched and displayed in real-time on this React dashboard.

<a name="features"></a>✨ Features

Real-time Data Visualization: Live updates from Firebase Realtime Database.

Interactive Dashboard:

Dynamic Line Charts for trend analysis (Temperature, Humidity, Pressure).

Color-coded Gauges for Particulate Matter (PM) levels.

Stat Cards for quick summary metrics.

Historical Data Export: Ability to download sensor logs as CSV files.

Responsive Design: Fully optimized for Desktop, Tablet, and Mobile devices.

Team Showcase: A "Character Select" style team page to credit contributors.

<a name="tech-stack"></a>🛠️ Tech Stack

Frontend Framework: React.js (Vite)

Language: JavaScript (ES6+)

Styling: CSS3 (Custom responsive grid system, CSS Variables)

Routing: React Router DOM (v6)

Backend / Database: Firebase Realtime Database

Charts & Visualization: Chart.js, React-Chartjs-2

Icons: Lucide React

<a name="getting-started"></a>🚀 Getting Started

If you are a new developer picking up this project, follow these steps to set up your local environment.

Prerequisites

Ensure you have the following installed on your machine:

Node.js (v16.0.0 or higher)

Check version: node -v

Download Node.js

Git

Check version: git --version

Download Git

Code Editor

We recommend Visual Studio Code.

<a name="installation--setup"></a>📥 Installation & Setup

1. Clone the Repository

Open your terminal (Command Prompt, PowerShell, or Terminal) and run:

git clone [https://github.com/YOUR-USERNAME/envi-sci-project.git](https://github.com/YOUR-USERNAME/envi-sci-project.git)
cd envi-sci-project


2. Install Dependencies

This command downloads all the libraries listed in package.json into a node_modules folder.

npm install


3. Start the Development Server

This runs the app locally on your machine.

npm run dev


You will see a local address, usually http://localhost:5173/. Open this link in your browser to view the app.

<a name="project-structure"></a>📂 Project Structure

Understanding the file layout is crucial for development.

envi-sci-project/
├── public/              # Static assets (images, logos)
│   ├── no-bg.png        # Main Logo
│   └── ...
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── aqDashboard/ # Components specific to Air Quality Dashboard
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── TrendChart.jsx  # Contains Chart logic & CSV Download
│   │   │   └── PMGauge.jsx
│   │   └── Navbar.jsx   # Global Navigation Bar
│   ├── pages/           # Main Page Views
│   │   ├── Homepage.jsx # Landing Page (Team Roster)
│   │   └── Section4C.jsx# Air Quality Dashboard Controller
│   ├── App.css          # Global Stylesheet (Responsive Layouts)
│   ├── App.jsx          # Main Router Setup
│   └── main.jsx         # React Entry Point
├── package.json         # List of dependencies
├── vite.config.js       # Vite configuration settings
└── README.md            # Project Documentation


<a name="configuration-firebase"></a>🔥 Configuration (Firebase)

The project is currently connected to a Firebase Realtime Database. The configuration is located in:
src/pages/Section4C.jsx

If you create a new Firebase project for production or testing, you must update the firebaseConfig object in that file:

const firebaseConfig = {
  apiKey: "YOUR_NEW_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "[https://your-database-url.firebaseio.com](https://your-database-url.firebaseio.com)",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};


Note: Never commit sensitive API keys if the repository is public. For a school project, this is often acceptable, but for professional deployment, use Environment Variables (.env).

<a name="contribution-guide"></a>🤝 Contribution Guide

We use Git for version control. Follow these rules to avoid breaking the code for others.

1. Pull Latest Changes

Always pull the latest code before starting your work to avoid conflicts.

git pull origin main


2. Create a Branch

Do not work directly on the main branch. Create a branch for your specific task.

# Syntax: git checkout -b <feature-name>
git checkout -b feature/update-navbar


3. Save Changes

After editing files, save them to the staging area.

git add .
git commit -m "Added a dropdown menu to the navbar"


4. Push to GitHub

Upload your branch to the cloud repository.

git push origin feature/update-navbar


5. Merge

Go to GitHub, open a Pull Request (PR), and merge your branch into main after reviewing the code.

<a name="future-roadmap"></a>🔮 Future Roadmap

This list serves as a guide for the next batch of developers continuing this project.

🌊 Phase 2: Water Quality (Section 4B)

Action: Create src/pages/Section4B.jsx.

Goal: Replicate the dashboard structure of Section 4C but utilize a Blue/Teal color scheme.

Sensors: Display metrics for pH Level, Turbidity (NTU), and Dissolved Oxygen.

📡 Phase 3: Hardware Integration

Action: Connect physical ESP32 devices to the Production Database.

Goal: Ensure the dashboard receives data every 5-10 seconds.

Task: Update the "Generate Mock History" logic in Section4C.jsx to fetch actual historical data from Firebase once logging is enabled on the hardware side.

📱 Phase 4: Mobile Optimization

Action: Refine CSS media queries.

Goal: Ensure charts are legible on small screens (iPhone SE / older Androids).

<a name="team--credits"></a>🏆 Team & Credits

Project Supervised by: Doc. Luna Dela Cruz

Section 4C (Air Quality Team)

TORRES, Abhrei Mikael D. - Project Research Lead

ALLAUIGAN, Maria Dianne Alexa R. - Lead Researcher

OCHAVILLO, Gladys A. - Research Analyst

BALDICANO, Kelly E. - UI/UX Engineer

FUERTES, David Israel J. - Frontend Developer

LISONDRA, Mike Jay-R B. - Backend Developer

SOMCIO, Justin Nathan Luis M. - Software Integrator

CATAYTAY, Algean - IoT & Procurement

BERMUDEZ, Charles Matthew D. - Hardware Lead

SANCHEZ, Daniel Roman B. - Chassis Designer

DULOT, William Maurice C. - Firmware Engineer

BONCAYAO, Dave Joshua D. - Hardware Support

CALIXTRO, Carlito - Hardware Support

LOPEZ, Harold B. - Hardware Support

SIQUIJOR, Lloyd - Hardware Support

Section 4B (Water Quality Team)

(List of Section 4B members to be added here)

Documentation generated for Envi-Sci Project 2025.
