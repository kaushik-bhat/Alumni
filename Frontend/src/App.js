// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login';
import Alumni from './Alumni';
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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={localStorage.getItem('userName') ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/alumni" element={<Alumni />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
