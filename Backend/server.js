// server.js
const express = require('express');
const cors = require('cors');
const db = require('./db');  // Import the shared db connection
const alumniRoutes = require('./alumni');  // Alumni route file
const loginRoutes = require('./login');    // Login route file

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(alumniRoutes);  // Use the alumni route
app.use(loginRoutes);   // Use the login route

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
