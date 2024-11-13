import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Admin.module.css';  // Import the CSS module

const Admin = () => {
  const [tableNames, setTableNames] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [tableStructure, setTableStructure] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  // Fetch table names from the backend on component mount
  useEffect(() => {
    const fetchTableNames = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/tables');
        const filteredTableNames = response.data.filter(table => table !== 'connection' && table !== 'admin');
        setTableNames(filteredTableNames);
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
          setTableStructure(response.data);
        } catch (err) {
          console.error('Error fetching table structure:', err);
          setError('Failed to fetch table structure');
        }
      }
    };

    fetchTableStructure();
  }, [selectedTable]);

  // Handle table selection
  const handleTableClick = (table) => {
    if (selectedTable === table) {
      setSelectedTable(null);
      setTableStructure(null);
    } else {
      setSelectedTable(table);
    }
  };

  const ErrorModal = ({ message, onClose }) => {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2>Error</h2>
          <p>{message}</p>
          <button onClick={onClose} className={styles.closeButton}>Close</button>
        </div>
      </div>
    );
  };

  // Handle action selection
  const handleActionClick = (action) => {
    if (selectedAction === action) {
      setSelectedAction(null);
    } else {
      setSelectedAction(action);
    }
  };

  // Handle form input changes
  const handleInputChange = (column, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [column]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formFields = tableStructure.map(col => ({
      column: col.column,
      value: formData[col.column] || null, // If value is empty, set it to null
    }));

    try {
      await axios.post(`http://localhost:5000/admin/insert/${selectedTable}`, formFields);
      alert('Data inserted successfully!');
      setFormData({});
    } catch (err) {
        console.error('Error inserting data:', err);
        setError(err.response?.data?.message || 'Failed to insert data'); // Display error message from backend
    }
  };

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}

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

      {/* Table Structure */}
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

      {/* Insert Form */}
      {selectedAction === 'Insert' && selectedTable && tableStructure && (
        <div className={styles.tableStructureBox}>
          <h2 className={styles.databaseHeading}>Insert Data into {selectedTable}</h2>
          <form onSubmit={handleSubmit}>
            {tableStructure.map((col, index) => (
              <div key={index} className={styles.formGroup}>
                <label htmlFor={col.column}>{col.column}</label>
                <input
                  type="text"
                  id={col.column}
                  name={col.column}
                  value={formData[col.column] || ''}
                  onChange={(e) => handleInputChange(col.column, e.target.value)}
                  required={col.dataType.toLowerCase().includes('not null')}
                />
              </div>
            ))}
            <button type="submit" className={styles.actionButton}>Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Admin;
