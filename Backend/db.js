const express = require('express');
const mysql = require('mysql2');
const app = express();

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Replace with your MySQL username
  password: 'SQLfor@1',   // Replace with your MySQL password
  database: 'alumni'
});

// Connect to database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Successfully connected to MySQL database');
});

// Create a route to fetch users
app.get('/users', (req, res) => {
  connection.query('SELECT * FROM user', (error, results) => {
    if (error) {
      console.error('Error fetching users:', error);
      res.status(500).send('Error fetching users');
      return;
    }
    
    console.log('Users from database:', results);
    res.json(results);
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});