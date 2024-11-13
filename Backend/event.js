// event.js
const express = require('express');
const db = require('./db');  // Import the shared db connection
const router = express.Router();

router.get('/events', (req, res) => {
  const query = `
    SELECT 
      Event_ID, Name, Date, Time, Location, Description 
    FROM Event;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Error retrieving events data' });
    }

    const events = results.map(row => ({
      Event_ID: row.Event_ID,
      Name: row.Name,
      Date: row.Date,
      Time: row.Time,
      Location: row.Location,
      Description: row.Description,
    }));

    res.json(events);
  });
});

module.exports = router;
