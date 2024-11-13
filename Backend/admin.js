const express = require('express');
const db = require('./db');  // Import your db connection
const router = express.Router();

// Route to fetch all table names
router.get('/tables', (req, res) => {
  // Query to show all tables in the database
  db.query('SHOW TABLES', (err, result) => {
    if (err) {
      console.error('Error fetching table names:', err);
      return res.status(500).json({ error: 'Failed to fetch table names' });
    }

    // The result is an array of objects, with each object representing a table
    const tableNames = result.map(row => Object.values(row)[0]); // Extract table names
    res.json(tableNames);  // Send table names as a JSON response
  });
});

router.get('/table-structure/:tableName', (req, res) => {
    const tableName = req.params.tableName;
  
    // Query to show the structure of the table (DESCRIBE command)
    db.query(`DESCRIBE ${tableName}`, (err, result) => {
      if (err) {
        console.error('Error fetching table structure:', err);
        return res.status(500).json({ error: 'Failed to fetch table structure' });
      }
  
      // Format the result to get columns and their data types
      const structure = result.map(row => ({
        column: row.Field,
        dataType: row.Type
      }));
  
      res.json(structure);  // Send table structure as a JSON response
    });
  });

  router.post('/insert/:tableName', (req, res) => {
    const tableName = req.params.tableName;
    const formData = req.body;
  
    // Prepare the columns and values for the insert query
    const columns = formData.map((field) => field.column).join(', ');
    const values = formData
      .map((field) => (field.value === null ? 'NULL' : `'${field.value}'`))
      .join(', ');
  
    // SQL query to insert data into the selected table
    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;
  
    // Execute the query
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(400).json({ message: err.sqlMessage || 'Failed to insert data' });
      }
      res.status(200).json({ message: 'Data inserted successfully' });
    });
  });

module.exports = router;
