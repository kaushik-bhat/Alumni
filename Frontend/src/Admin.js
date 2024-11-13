import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Admin.module.css';  // Import the CSS module

const Admin = () => {
  const [tableNames, setTableNames] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);  // State for selected action
  const [tableStructure, setTableStructure] = useState(null);  // State for table structure
  const [error, setError] = useState(null);

  // Fetch table names from the backend on component mount
  useEffect(() => {
    const fetchTableNames = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/tables');
        
        // Filter out the 'connection' table
        const filteredTableNames = response.data.filter(table => table !== 'connection' && table !== 'admin');
        setTableNames(filteredTableNames);  // Set the filtered table names
      } catch (err) {
        setError('Failed to fetch table names. Please try again later.');
        console.error('Error fetching table names:', err);
      }
    };

    fetchTableNames();
  }, []);

  // Fetch table structure when a table is selected
  useEffect(() => {
    const fetchTableStructure = async () => {
      if (selectedTable) {
        try {
          const response = await axios.get(`http://localhost:5000/admin/table-structure/${selectedTable}`);
          setTableStructure(response.data);  // Set the fetched table structure
        } catch (err) {
          console.error('Error fetching table structure:', err);
          setError('Failed to fetch table structure');
        }
      }
    };

    fetchTableStructure();
  }, [selectedTable]);

  const handleTableClick = (table) => {
    // If the clicked table is already selected, unselect it
    if (selectedTable === table) {
      setSelectedTable(null);
      setTableStructure(null); // Reset table structure when unselected
    } else {
      setSelectedTable(table);
    }
  };

  const handleActionClick = (action) => {
    // If the clicked action is already selected, unselect it
    if (selectedAction === action) {
      setSelectedAction(null);
    } else {
      setSelectedAction(action);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.mainContent}>
        <div className={styles.tablesContainer}>
          <h2 className={styles.databaseHeading}>Database Tables</h2>
          <div className={styles.tablesBox}>
            {tableNames.length > 0 ? (
              tableNames.map((table, index) => (
                <button
                  key={index}
                  className={`${styles.tableButton} ${selectedTable === table ? styles.selectedTable : ''}`}
                  onClick={() => handleTableClick(table)}
                >
                  {table}
                </button>
              ))
            ) : (
              <p className={styles.noData}>No tables found</p>
            )}
          </div>
        </div>

        <div className={styles.actionsBox}>
          <h2 className={styles.databaseHeading}>Actions</h2>
          <button
            className={`${styles.actionButton} ${selectedAction === 'Insert' ? styles.selectedAction : ''}`}
            onClick={() => handleActionClick('Insert')}
          >
            Insert
          </button>
          <button
            className={`${styles.actionButton} ${selectedAction === 'Edit' ? styles.selectedAction : ''}`}
            onClick={() => handleActionClick('Edit')}
          >
            Edit
          </button>
          <button
            className={`${styles.actionButton} ${selectedAction === 'Delete' ? styles.selectedAction : ''}`}
            onClick={() => handleActionClick('Delete')}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Display Table Structure if a table is selected */}
      {selectedTable && tableStructure && (
        <div className={styles.tableStructureBox}>
          <h2 className={styles.databaseHeading}>Table Structure: {selectedTable}</h2>
          <div className={styles.structureList}>
            {tableStructure.length > 0 ? (
              tableStructure.map((col, index) => (
                <div key={index} className={styles.columnInfo}>
                  <strong>{col.column}</strong>: {col.dataType}
                </div>
              ))
            ) : (
              <p>No columns found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
