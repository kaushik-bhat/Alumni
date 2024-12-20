// server.js
const express = require('express');
const cors = require('cors');
const db = require('./db');  // Import the shared db connection
const alumniRoutes = require('./alumni');  // Alumni route file
const loginRoutes = require('./login');    // Login route file
const profileRoutes = require('./profile'); // Import the profile route file
const eventRoutes = require('./event'); //import the event route file
const adminRoutes = require('./admin'); //import the admin route file

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(alumniRoutes);  // Use the alumni route
app.use(loginRoutes);   // Use the login route  
app.use(profileRoutes); // Use the profile route
app.use(eventRoutes); // use the event route
app.use('/admin',adminRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
