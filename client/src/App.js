import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BookingPage from './components/BookingPage';
import Navbar from './components/Navbar';
import Services from './components/Services';
import Contact from './components/Contact';
import './App.css';

function HomePage() {
  return (
    <>
      <Navbar />
      <div className="spa-app-bg">
        <div className="spa-content-wrapper">
          <div className="hero-section">
            <div className="spa-container hero-container">
              <h1 className="spa-title">Six Spa</h1>
              <p className="spa-subtitle">Book your moment of tranquility</p>
              <Link to="/booking" className="spa-btn">
                Book Now
              </Link>
            </div>
          </div>
          <div className="services-wrapper">
            <Services />
          </div>
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
