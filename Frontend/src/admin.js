// src/Admin.js
import React from 'react';
import './admin.css'; // Import any specific CSS for the admin page if needed

const AdminPage = () => {
  return (
    <div className="admin-page">
      <h2>Admin Dashboard</h2>
      <p>Manage events and users here.</p>

      {/* Add buttons or forms for admin actions */}
      <div className="admin-actions">
        <button className="admin-button">Add Event</button>
        <button className="admin-button">Remove Event</button>
        <button className="admin-button">Remove User</button>
      </div>
    </div>
  );
};

export default AdminPage;
