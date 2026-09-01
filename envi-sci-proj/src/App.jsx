import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Section4C from "./pages/Section4C";
import Section4B from "./pages/Section4B";
import "./App.css";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./context/ThemeContext"; 

function App() {
  return (
    <ThemeProvider> {/* <--- WRAP EVERYTHING */}
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/section4c" element={<Section4C />} />
          <Route path="/section4b" element={<Section4B />} />
          <Route path="*" element={<Homepage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;