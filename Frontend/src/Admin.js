import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Admin.module.css';  // Import the CSS module

const Admin = () => {
  const [tableNames, setTableNames] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [tableStructure, setTableStructure] = useState(null);
  const [deleteKeyValue, setDeleteKeyValue] = useState('');
  const [formData, setFormData] = useState({});
  const [editData, setEditData] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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

  // Handle data loading for edit action
useEffect(() => {
  const fetchEditData = async () => {
    if (selectedAction === 'Edit' && selectedTable) {
      try {
        const response = await axios.get(`http://localhost:5000/admin/table-structure/${selectedTable}`);
        setEditData(response.data.reduce((acc, col) => ({ ...acc, [col.column]: '' }), {}));
      } catch (err) {
        console.error('Error fetching data for edit:', err);
        setError('Failed to fetch data for edit');
      }
    }
  };

  fetchEditData();
}, [selectedTable, selectedAction]);

const handleEditSubmit = async (e) => {
  e.preventDefault();

  const formFields = tableStructure.map((col) => ({
    column: col.column,
    value: editData[col.column] || '', // Use editData values
  }));

  try {
    await axios.post(`http://localhost:5000/admin/update/${selectedTable}`, formFields);
    setSuccessMessage('Data updated successfully!');
    setEditData({});
  } catch (err) {
    console.error('Error updating data:', err);
    setError(err.response?.data?.message || 'Failed to update data');
  }
};

  // Handle table selection
  const handleTableClick = (table) => {
    if (selectedTable === table) {
      setSelectedTable(null);
      setTableStructure(null);
    } else {
      setSelectedTable(table);
    }
  };

  const MessageModal = ({ message, type, onClose }) => {
    return (
      <div className={styles.modalOverlay}>
        <div className={`${styles.modalContent} ${type === 'success' ? styles.successModal : styles.errorModal}`}>
          <h2>{type === 'success' ? 'Success' : 'Error'}</h2>
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

  const handleEditInputChange = (column, value) => {
    setEditData((prevData) => ({
      ...prevData,
      [column]: value,
    }));
  };

  const handleDeleteInputChange = (value) => {
    setDeleteKeyValue(value);
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
  
    // Get the primary key column name (assumed to be the first column)
    const primaryKey = tableStructure[0].column;
  
    try {
      await axios.post(`http://localhost:5000/admin/delete/${selectedTable}`, {
        primaryKey,
        primaryKeyValue: deleteKeyValue
      });
      setSuccessMessage('Row deleted successfully!');
      setDeleteKeyValue(''); // Clear the input after deletion
    } catch (err) {
      console.error('Error deleting data:', err);
      setError(err.response?.data?.message || 'Failed to delete data');
    }
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
      setSuccessMessage('Data inserted successfully!');
      setFormData({});
    } catch (err) {
        console.error('Error inserting data:', err);
        setError(err.response?.data?.message || 'Failed to insert data'); // Display error message from backend
    }
  };

  const handleTotalFundsClick = async () => {
    try {
      const response = await axios.get('http://localhost:5000/admin/total-funds');
      setSuccessMessage(`Total Funds: ${response.data.totalFunds}`); // Display the total funds
    } catch (err) {
      console.error('Error fetching total funds:', err);
      setError('Failed to fetch total funds.');
    }
  };

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      {error && <MessageModal message={error} type="error" onClose={() => setError(null)} />}
{successMessage && <MessageModal message={successMessage} type="success" onClose={() => setSuccessMessage(null)} />}

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
          <button
            className={`${styles.actionButton}`}
            onClick={handleTotalFundsClick}
          >
            Total Funds
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
      {selectedAction === 'Edit' && selectedTable && tableStructure && (
  <div className={styles.tableStructureBox}>
    <h2 className={styles.databaseHeading}>Edit Data in {selectedTable}</h2>
    <form onSubmit={handleEditSubmit}>
      {tableStructure.map((col, index) => (
        <div key={index} className={styles.formGroup}>
          <label htmlFor={col.column}>{col.column}</label>
          <input
            type="text"
            id={col.column}
            name={col.column}
            value={editData[col.column] || ''}
            onChange={(e) => handleEditInputChange(col.column, e.target.value)}
            required={index === 0} // Assume the first column is the primary key
          />
        </div>
      ))}
      <button type="submit" className={styles.actionButton}>Submit</button>
    </form>
  </div>
)}
{selectedAction === 'Delete' && selectedTable && tableStructure && (
  <div className={styles.tableStructureBox}>
    <h2 className={styles.databaseHeading}>Delete Row from {selectedTable}</h2>
    <form onSubmit={handleDeleteSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="primaryKeyValue">{tableStructure[0].column} (Primary Key)</label>
        <input
          type="text"
          id="primaryKeyValue"
          name="primaryKeyValue"
          value={deleteKeyValue}
          onChange={(e) => handleDeleteInputChange(e.target.value)}
          required
        />
      </div>
      <button type="submit" className={styles.actionButton}>Delete</button>
    </form>
  </div>
)}
    </div>
  );
};

export default Admin;
