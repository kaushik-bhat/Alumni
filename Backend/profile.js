// profile.js
const express = require('express');
const db = require('./db'); // Import the shared db connection
const router = express.Router();

router.get('/profile/:id/:userType', (req, res) => {
  const { id, userType } = req.params;
  let tableName;

  // Determine table based on userType
  if (userType === 'admin') {
    tableName = 'Admin';
  } else if (userType === 'student') {
    tableName = 'Student';
  } else {
    return res.status(400).json({ success: false, message: 'Invalid user type' });
  }

  // Step 1: Get the User_ID based on ID in either Admin or Student table
  const idQuery = `SELECT User_ID FROM ${tableName} WHERE ${userType === 'admin' ? 'Admin_ID' : 'Student_ID'} = ?`;

  db.query(idQuery, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userID = results[0].User_ID;

    // Step 2: Fetch user profile information from User table
    const userQuery = `
      SELECT User_ID, Name, Email, Profile_Picture, Academic_Details, Professional_Details 
      FROM User WHERE User_ID = ?
    `;

    db.query(userQuery, [userID], (err, userResults) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
      }

      if (userResults.length > 0) {
        const user = userResults[0];
        user.Profile_Picture = user.Profile_Picture ? Buffer.from(user.Profile_Picture).toString('base64') : null;
        res.json({ success: true, userData: user });
      } else {
        res.status(404).json({ success: false, message: 'User not found' });
      }
    });
  });
});

module.exports = router;
