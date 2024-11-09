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

// Create a route to fetch and display users
app.get('/users', (req, res) => {
  connection.query('SELECT * FROM user', (error, results) => {
    if (error) {
      console.error('Error fetching users:', error);
      res.status(500).send('Error fetching users');
      return;
    }

    // Generate HTML to display users with image and info
    let html = `
      <html>
        <head>
          <style>
            .container {
              display: flex;
              align-items: center;
              padding: 10px;
              border: 1px solid #ddd;
              border-radius: 8px;
              max-width: 600px;
              margin: 10px auto;
              font-family: Arial, sans-serif;
            }
            .image-container {
              flex: 0 0 80px;
              margin-right: 20px;
            }
            .image {
              width: 80px;
              height: 80px;
              border-radius: 50%;
              object-fit: cover;
            }
            .info-container {
              flex: 1;
            }
            .name {
              font-size: 20px;
              margin: 0 0 5px 0;
            }
            .email {
              color: #555;
            }
          </style>
        </head>
        <body>
          <h1>User Profiles</h1>
    `;

    // Loop through each user and generate HTML content
    results.forEach(user => {
      let profilePicture = '';
      if (user.Profile_Picture) {
        profilePicture = Buffer.from(user.Profile_Picture).toString('base64');
      }
      html += `
        <div class="container">
          <div class="image-container">
            <img src="data:image/png;base64,${profilePicture}" alt="Profile" class="image" />
          </div>
          <div class="info-container">
            <h2 class="name">${user.Name}</h2>
            <p class="email">${user.Email}</p>
          </div>
        </div>
      `;
    });

    // Close the HTML body and send the response
    html += `
        </body>
      </html>
    `;

    res.send(html);
  });
});

// Start server
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
