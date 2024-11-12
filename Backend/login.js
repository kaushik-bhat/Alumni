// Backend: login.js
const express = require('express');
const db = require('./db');  // Import the shared db connection

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password, userType } = req.body;
  let tableName;

  // Determine table based on userType
  if (userType === 'admin') {
    tableName = 'admin';
  } else if (userType === 'student') {
    tableName = 'student';
  } else {
    return res.status(400).json({ success: false, message: 'Invalid user type' });
  }

  const query = `SELECT User_ID, Name, Email FROM ${tableName} WHERE Email = ? AND Password = ?`;
  
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
    
    if (results.length > 0) {
      res.json({
        success: true,
        message: 'Login successful',
        userData: {
          User_ID: results[0].User_ID,
          Name: results[0].Name,
          Email: results[0].Email,
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  });
});

module.exports = router;
