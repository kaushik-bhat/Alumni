const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Replace with your MySQL username
    password: 'SQLfor@1',   // Replace with your MySQL password
    database: 'alumni'
  });

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    // Query matching your table structure
    const query = 'SELECT User_ID, Name, Email FROM user WHERE Email = ? AND Password = ?';
    
    db.query(query, [email, password], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Server error' 
        });
      }
  
      if (results.length > 0) {
        // Return success with user data (excluding sensitive information)
        res.json({ 
          success: true, 
          message: 'Login successful',
          userData: {
            User_ID: results[0].User_ID,
            Name: results[0].Name,
            Email: results[0].Email
          }
        });
      } else {
        res.status(401).json({ 
          success: false, 
          message: 'Invalid email or password' 
        });
      }
    });
  });
  
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });