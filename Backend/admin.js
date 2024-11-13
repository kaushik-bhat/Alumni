const express = require('express');
const db = require('./db');  // Import your db connection
const router = express.Router();

// Route to fetch all table names
router.get('/tables', (req, res) => {
  // Query to show all tables in the database
  db.query('SHOW TABLES', (err, result) => {
    if (err) {
      console.error('Error fetching table names:', err);
      return res.status(500).json({ error: 'Failed to fetch table names' });
    }

    // The result is an array of objects, with each object representing a table
    const tableNames = result.map(row => Object.values(row)[0]); // Extract table names
    res.json(tableNames);  // Send table names as a JSON response
  });
});

module.exports = router;
