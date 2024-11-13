import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Admin.module.css';  // Import the CSS module

const Admin = () => {
  const [tableNames, setTableNames] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);  // State for selected action
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

  const handleTableClick = (table) => {
    setSelectedTable(table);
  };

  const handleActionClick = (action) => {
    setSelectedAction(action);
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
    </div>
  );
};

export default Admin;
