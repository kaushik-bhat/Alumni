import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [id, setId] = useState('');  // New state for ID
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userType) {
      setError('Please select Admin or Student');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
        id,       // Include ID in the request payload
        userType,
      });
      
      if (response.data.success) {
        localStorage.setItem('userName', response.data.userData.Name);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="main-container">
      <header className="header">
        <h1 className="header-title">Alumni Portal</h1>
      </header>

      <div className="login-content">
        <div className="button-group">
          <button
            className={`user-type-button ${userType === 'admin' ? 'active' : ''}`}
            onClick={() => handleUserTypeSelect('admin')}
          >
            Admin
          </button>
          <button
            className={`user-type-button ${userType === 'student' ? 'active' : ''}`}
            onClick={() => handleUserTypeSelect('student')}
          >
            Student
          </button>
        </div>

        <div className="login-box">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">ID</label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="form-input"
                placeholder="Enter your ID"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="submit-button">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;