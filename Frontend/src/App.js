// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import './App.css';

// Simple Home component
const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Alumni Portal</h1>
      {/* Add your home page content here */}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect from root to login if not authenticated */}
        <Route
          path="/"
          element={
            localStorage.getItem('userName') ? <Home /> : <Navigate to="/login" />
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
