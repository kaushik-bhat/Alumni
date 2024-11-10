// server.js
const express = require('express');
const cors = require('cors');
const db = require('./db');  // Import the shared db connection
const alumniRoutes = require('./alumni');  // Alumni route file

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(alumniRoutes);  // Use the alumni route

// Login route (can access the shared db connection)
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT User_ID, Name, Email FROM user WHERE Email = ? AND Password = ?';
  
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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
