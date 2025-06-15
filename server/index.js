require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';  // Listen on all network interfaces
const MAX_OCCUPANCY = 5;  // Maximum number of people allowed per time slot

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React build directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify email configuration
console.log('Email configuration:', {
  user: process.env.EMAIL_USER ? 'Set' : 'Not set',
  pass: process.env.EMAIL_PASS ? 'Set' : 'Not set'
});

// Test email configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// SQLite DB setup
const dbPath = path.resolve(__dirname, 'spa-booking.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  }
});

// Create bookings table if not exists
const createTable = `CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  people INTEGER NOT NULL
);`;
db.run(createTable);

// Placeholder route
app.get('/', (req, res) => {
  res.send('Spa Booking API is running');
});

// POST endpoint for booking submissions
app.post('/api/bookings', (req, res) => {
  const { name, email, date, time, people } = req.body;
  if (!name || !email || !date || !time || !people) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check occupancy for the requested slot
  const checkOccupancy = `SELECT SUM(people) as total FROM bookings WHERE date = ? AND time = ?`;
  db.get(checkOccupancy, [date, time], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    const currentOccupancy = row.total || 0;
    if (currentOccupancy + parseInt(people) > MAX_OCCUPANCY) {
      return res.status(400).json({ error: 'Slot is full' });
    }

    // Insert booking
    const insertBooking = `INSERT INTO bookings (name, email, date, time, people) VALUES (?, ?, ?, ?, ?)`;
    db.run(insertBooking, [name, email, date, time, people], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to book' });
      }

      const bookingData = {
        message: 'Booking confirmed',
        booking: {
          id: this.lastID,
          name,
          email,
          date,
          time,
          people: parseInt(people)
        }
      };

      // Send confirmation email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Six Spa - Booking Confirmation',
        html: `
          <h2>Booking Confirmation</h2>
          <p>Dear ${name},</p>
          <p>Thank you for choosing Six Spa. Your booking has been confirmed.</p>
          <p><strong>Booking Details:</strong></p>
          <ul>
            <li>Date: ${new Date(date).toLocaleDateString()}</li>
            <li>Time: ${time}</li>
            <li>Number of guests: ${people}</li>
            <li>Booking reference: #${this.lastID}</li>
          </ul>
          <p>We look forward to welcoming you!</p>
          <p>Best regards,<br>Six Spa Team</p>
        `
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          // Still send success response even if email fails
        }
      });

      res.status(201).json(bookingData);
    });
  });
});

// GET endpoint for availability
app.get('/api/availability', (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: 'Date is required' }); 
  }

  const getAvailability = `
    SELECT time, SUM(people) as total
    FROM bookings
    WHERE date = ?
    GROUP BY time
  `;

  db.all(getAvailability, [date], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // Convert rows to availability object
    const availability = {};
    rows.forEach(row => {
      availability[row.time] = row.total;
    });

    res.json(availability);
  });
});

// TODO: Add booking routes here

// Handle React routing in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
}); 