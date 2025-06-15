import React from 'react';
import Navbar from './Navbar';

function Contact() {
  return (
    <>
      <Navbar />
      <div className="spa-app-bg">
        <div className="spa-container">
          <h1 className="spa-title">Contact Us</h1>
          <p className="spa-subtitle">Get in touch with our team</p>
          
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <h3>Location</h3>
                <p></p>
                <p></p>
              </div>
              
              <div className="contact-item">
                <h3>Hours</h3>
                <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                <p>Saturday - Sunday: 10:00 AM - 6:00 PM</p>
              </div>
              
              <div className="contact-item">
                <h3>Contact</h3>
                <p>Phone: </p>
                <p>Email: </p>
              </div>
            </div>

            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" placeholder="Your name" />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Your email" />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" placeholder="Your message" rows="4"></textarea>
              </div>
              
              <button type="submit" className="spa-btn">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact; 