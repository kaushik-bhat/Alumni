// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login';
import Alumni from './Alumni';
import Profile from './Profile'; // Import the new Profile component
import Events from './Events';
import './App.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Alumni Portal</h1>
      <button className="alumni-button" onClick={() => navigate('/alumni')}>
        View Alumni
      </button>
    </div>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <button onClick={() => navigate('/')} className="nav-button">Home</button>
      <button onClick={() => navigate('/profile')} className="nav-button">Profile</button>
      <button onClick={() => navigate('/events')} className="nav-button">Events</button>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
