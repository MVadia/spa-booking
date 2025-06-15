import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="spa-nav">
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/" className="nav-logo">Six Spa</Link>
        </div>
        <button 
          className={`mobile-menu-btn ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/booking" className="nav-link" onClick={() => setIsMenuOpen(false)}>Book Now</Link>
          <a href="#services" className="nav-link" onClick={() => setIsMenuOpen(false)}>Services</a>
          <Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>Contact</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 