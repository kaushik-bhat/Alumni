// server.js
const express = require('express');
const cors = require('cors');
const db = require('./db');  // Import the shared db connection
const alumniRoutes = require('./alumni');  // Alumni route file
const loginRoutes = require('./login');    // Login route file
const eventRoutes = require('./event');    // Event route file
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', alumniRoutes);  // Use the alumni route
app.use('/api', loginRoutes);   // Use the login route
app.use('/api', eventRoutes);   // Use the event route

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
