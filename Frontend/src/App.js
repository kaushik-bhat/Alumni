// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login';
import Alumni from './Alumni';
import Homepage from './Homepage';
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

function App() {
  const isLoggedIn = localStorage.getItem('userName') !== null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/alumni" element={isLoggedIn ? <Alumni /> : <Navigate to="/login" />} />
        <Route path="/homepage" element={<Homepage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
