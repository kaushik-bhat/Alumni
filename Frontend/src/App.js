// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login';
import Alumni from './Alumni';
import Profile from './Profile'; // Import the Profile component
import Events from './Events';
import AdminPage from './admin';
import './App.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="main-content">
      <div className="landing">
        <section className="landing-content">
          <h1 className="landing-title">Welcome to the PESU Alumni Network</h1>
          <p>Connect with fellow alumni, attend events, and grow your career!</p>
          <button className="join-button" onClick={() => navigate('/alumni')}>View Alumni</button>
        </section>
      </div>
    </div>
  );
};

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  const handleAdminPage = () => {
    const userType = localStorage.getItem('userType');
    if (userType === 'admin') {
      navigate('/admin'); // Redirect to admin page if the user is an admin
    } else {
      alert('No access'); // Show "No access" message for non-admin users
    }
  };

  return (
    <nav className="navbar">
      <button onClick={() => navigate('/')} className="nav-button">Home</button>
      <button onClick={() => navigate('/profile')} className="nav-button">Profile</button>
      <button onClick={() => navigate('/events')} className="nav-button">Events</button>
      <button onClick={handleAdminPage} className="nav-button admin-button">Admin</button>
      <button onClick={handleLogout} className="nav-button">Logout</button>
      
    </nav>
  );
};

function App() {
  const isLoggedIn = localStorage.getItem('userName') !== null;

  return (
    <BrowserRouter>
      {isLoggedIn && <Navbar />} {/* Show Navbar if logged in */}
      <Routes>
        <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/alumni" element={isLoggedIn ? <Alumni /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/events" element={isLoggedIn ? <Events /> : <Navigate to="/login" />} />
        {/* Protected admin route */}
        <Route path="/admin" element={isLoggedIn && localStorage.getItem('userType') === 'admin' ? <AdminPage /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}



export default App;
