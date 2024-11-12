const express = require('express');
const db = require('./db'); // Import the shared db connection

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password, id, userType } = req.body;
  let tableName;

  // Determine table based on userType
  if (userType === 'admin') {
    tableName = 'Admin';
  } else if (userType === 'student') {
    tableName = 'Student';
  } else {
    return res.status(400).json({ success: false, message: 'Invalid user type' });
  }

  // Step 1: Verify the ID exists in the correct table and get the associated User_ID
  const idQuery = `SELECT User_ID FROM ${tableName} WHERE ${userType === 'admin' ? 'Admin_ID' : 'Student_ID'} = ?`;

  db.query(idQuery, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    if (results.length === 0) {
      // ID doesn't exist in the specified table
      return res.status(401).json({ success: false, message: `ID not found for ${userType}` });
    }

    const userID = results[0].User_ID;

    // Step 2: Use User_ID to verify email and password in the User table
    const userQuery = `SELECT User_ID, Name, Email FROM User WHERE User_ID = ? AND BINARY Email = ? AND BINARY Password = ?`;

    db.query(userQuery, [userID, email, password], (err, userResults) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
      }

      if (userResults.length > 0) {
        res.json({
          success: true,
          message: 'Login successful',
          userData: {
            User_ID: userResults[0].User_ID,
            Name: userResults[0].Name,
            Email: userResults[0].Email,
          },
        });
      } else {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    });
  });
});

module.exports = router;
