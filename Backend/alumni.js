// alumni.js
const express = require('express');
const db = require('./db');  // Import the shared db connection
const router = express.Router();

router.get('/alumni', (req, res) => {
  const query = `
    SELECT 
      a.Alumni_ID, a.Name AS AlumniName, a.Graduation_Year, a.Profession,
      u.Profile_Picture, u.Academic_Details, u.Professional_Details
    FROM Alumni a
    LEFT JOIN User u ON a.User_ID = u.User_ID;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Error retrieving alumni data' });
    }

    const alumni = results.map(row => ({
      Alumni_ID: row.Alumni_ID,
      Name: row.AlumniName,
      Graduation_Year: row.Graduation_Year,
      Profession: row.Profession,
      Profile_Picture: row.Profile_Picture ? Buffer.from(row.Profile_Picture).toString('base64') : null,
      Academic_Details: row.Academic_Details,
      Professional_Details: row.Professional_Details,
    }));

    res.json(alumni);
  });
});

module.exports = router;
