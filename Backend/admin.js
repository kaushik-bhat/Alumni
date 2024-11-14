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

  router.post('/update/:tableName', async (req, res) => {
    const tableName = req.params.tableName;
    const formData = req.body;
  
    // Check for primary key in the data (assumed to be the first column)
    const primaryKey = formData[0].column;
    const primaryKeyValue = formData[0].value;
  
    if (!primaryKeyValue) {
      return res.status(400).json({ message: `Primary key (${primaryKey}) cannot be empty for update.` });
    }
  
    // Prepare the update query by excluding fields with empty values
    const updates = formData
      .filter(field => field.value !== '' && field.column !== primaryKey)
      .map(field => `${field.column} = '${field.value}'`)
      .join(', ');

      if (!updates) {
        return res.status(400).json({ message: 'No fields to update' });
      }

      const checkQuery = `SELECT * FROM ${tableName} WHERE ${primaryKey} = '${primaryKeyValue}' LIMIT 1`;

      db.query(checkQuery, (err, result) => {
        if (err) {
          console.error('Error checking data existence:', err);
          return res.status(400).json({ message: 'Failed to check data existence' });
        }
    
        // If no rows were found, send an error response
        if (result.length === 0) {
          return res.status(404).json({ message: 'Entry does not exist in the selected table' });
        }
      });
  
    const query = `UPDATE ${tableName} SET ${updates} WHERE ${primaryKey} = '${primaryKeyValue}'`;
  
    // Execute the update query
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error updating data:', err);
        return res.status(400).json({ message: err.sqlMessage || 'Failed to update data' });
      }
      res.status(200).json({ message: 'Data updated successfully' });
    });
  });

  router.post('/delete/:tableName', (req, res) => {
    const tableName = req.params.tableName;
    const { primaryKey, primaryKeyValue } = req.body;
  
    if (!primaryKeyValue) {
      return res.status(400).json({ message: 'Primary key value is required for deletion.' });
    }
  
    // First, check if the row exists
    const checkQuery = `SELECT * FROM ${tableName} WHERE ${primaryKey} = '${primaryKeyValue}' LIMIT 1`;
  
    db.query(checkQuery, (err, result) => {
      if (err) {
        console.error('Error checking data existence:', err);
        return res.status(400).json({ message: 'Failed to check data existence' });
      }
  
      // If no rows were found, send an error response
      if (result.length === 0) {
        return res.status(404).json({ message: 'Entry does not exist in the selected table' });
      }
  
      // If the row exists, proceed with deletion
      const deleteQuery = `DELETE FROM ${tableName} WHERE ${primaryKey} = '${primaryKeyValue}'`;
      db.query(deleteQuery, (err, result) => {
        if (err) {
          console.error('Error deleting data:', err);
          return res.status(400).json({ message: err.sqlMessage || 'Failed to delete data' });
        }
        res.status(200).json({ message: 'Data deleted successfully' });
      });
    });
  });



module.exports = router;
