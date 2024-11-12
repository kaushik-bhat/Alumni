const express = require('express');
const db = require('./db');  // Import the shared db connection
const router = express.Router();

// Get all events
router.get('/event', (req, res) => {
  const query = `
    SELECT 
      Event_ID, Name, Date, Time, Location, Description, Image
    FROM Event;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Error retrieving event data' });
    }

    // Debugging: Check if the results have image data and log it
    results.forEach((row) => {
      console.log(`Event ID: ${row.Event_ID}, Image Data Length: ${row.Image ? row.Image.length : 'No Image'}`);
    });

    const events = results.map(row => {
      // Check if the Image field is not null or empty and convert it to base64
      const base64Image = row.Image ? Buffer.from(row.Image).toString('base64') : null;

      // Log the image data for debugging
      if (base64Image) {
        console.log(`Event ID: ${row.Event_ID}, Image Base64 Length: ${base64Image.length}`);
      } else {
        console.log(`Event ID: ${row.Event_ID}, No image data available`);
      }

      return {
        Event_ID: row.Event_ID,
        Name: row.Name,
        Date: row.Date,
        Time: row.Time,
        Location: row.Location,
        Description: row.Description,
        Image: base64Image,  // Convert image to base64 if available
      };
    });

    // Return the event data in JSON format
    res.json(events);
  });
});

module.exports = router;
