import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { API_URL } from '../config';
import 'react-calendar/dist/Calendar.css';

const MAX_OCCUPANCY = 5;
const TIME_SLOTS = [
  { time: '10:00', label: '10:00 AM' },
  { time: '12:00', label: '12:00 PM' },
  { time: '14:00', label: '2:00 PM' },
  { time: '16:00', label: '4:00 PM' },
  { time: '18:00', label: '6:00 PM' }
];

function BookingPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [people, setPeople] = useState(1);
  const [confirmation, setConfirmation] = useState(null);
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch availability for the selected date
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedDate) return;
      
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/availability?date=${format(selectedDate, 'yyyy-MM-dd')}`);
        const data = await response.json();
        setAvailability(data);
      } catch (error) {
        alert('Error fetching availability');
      }
      setLoading(false);
    };

    fetchAvailability();
  }, [selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    const bookingData = {
      name,
      email,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      people
    };

    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      const data = await response.json();
      
      if (response.ok && data.booking) {
        setConfirmation(data.booking);
        setName('');
        setEmail('');
        setPeople(1);
        setSelectedTime('');
        // Refresh availability after successful booking
        const availabilityResponse = await fetch(`${API_URL}/api/availability?date=${format(selectedDate, 'yyyy-MM-dd')}`);
        const availabilityData = await availabilityResponse.json();
        setAvailability(availabilityData);
      } else {
        alert(data.error || 'Booking failed');
      }
    } catch (error) {
      alert('Error connecting to server');
    }
  };

  const getTileClassName = ({ date }) => {
    const today = new Date();
    if (date < today) return 'disabled-date';
    return '';
  };

  const getTimeSlotClass = (time) => {
    const slotAvailability = availability[time] || 0;
    const remainingSpaces = MAX_OCCUPANCY - slotAvailability;
    
    if (remainingSpaces === 0) return 'time-slot-full';
    if (remainingSpaces <= 2) return 'time-slot-limited';
    return 'time-slot-available';
  };

  return (
    <>
      <Navbar />
      <div className="spa-app-bg">
        <div className="spa-container">
          <h1 className="spa-title">Six Spa</h1>
          <p className="spa-subtitle">Book your moment of tranquility</p>
          
          {!confirmation ? (
            <div className="booking-flow">
              <div className="calendar-section">
                <h3>Select a Date</h3>
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  minDate={new Date()}
                  tileClassName={getTileClassName}
                  className="spa-calendar"
                />
              </div>

              {selectedDate && (
                <div className="time-slots-section">
                  <h3>Available Times for {format(selectedDate, 'MMMM d, yyyy')}</h3>
                  {loading ? (
                    <div className="loading-message">Loading availability...</div>
                  ) : (
                    <div className="time-slots-grid">
                      {TIME_SLOTS.map(({ time, label }) => {
                        const slotAvailability = availability[time] || 0;
                        const remainingSpaces = MAX_OCCUPANCY - slotAvailability;
                        const isFull = remainingSpaces === 0;
                        
                        return (
                          <button
                            key={time}
                            className={`time-slot ${getTimeSlotClass(time)} ${selectedTime === time ? 'selected' : ''}`}
                            onClick={() => !isFull && setSelectedTime(time)}
                            disabled={isFull}
                          >
                            <span className="time-label">{label}</span>
                            <span className="availability">
                              {isFull ? 'Fully Booked' : `${remainingSpaces} ${remainingSpaces === 1 ? 'space' : 'spaces'} left`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {selectedDate && selectedTime && (
                <form className="booking-form" onSubmit={handleSubmit}>
                  <label>
                    Your Name
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </label>
                  <label>
                    Your Email
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                    />
                  </label>
                  <label>
                    Number of Guests
                    <input
                      type="number"
                      min="1"
                      max={MAX_OCCUPANCY - (availability[selectedTime] || 0)}
                      value={people}
                      onChange={(e) => setPeople(e.target.value)}
                      required
                    />
                  </label>
                  <button className="spa-btn" type="submit">
                    Reserve Your Space
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="spa-confirmation">
              <h2>Booking Confirmed!</h2>
              <p>Thank you for choosing Six Spa, {confirmation.name}.</p>
              <p>We look forward to welcoming you on {new Date(confirmation.date).toLocaleDateString()} at {confirmation.time}.</p>
              <p>Number of guests: {confirmation.people}</p>
              <p>Booking reference: #{confirmation.id}</p>
              <p>A confirmation email has been sent to {confirmation.email}</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
                <button 
                  className="spa-btn" 
                  onClick={() => setConfirmation(null)}
                >
                  Make Another Booking
                </button>
                <Link to="/" className="spa-btn">
                  Return Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default BookingPage; 