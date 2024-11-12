// src/Profile.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null); // State to hold user data
  const userName = localStorage.getItem('userName');
  const id = localStorage.getItem('id');  // Store user ID
  const userType = localStorage.getItem('userType');  // Store user type

  useEffect(() => {
    if (!userName || !id || !userType) {
      navigate('/login');
      return;
    }

    // Fetch user profile data
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/profile/${id}/${userType}`);
        if (response.data.success) {
          setUserData(response.data.userData);
        } else {
          navigate('/login');  // Redirect to login if user data retrieval fails
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        navigate('/login');
      }
    };

    fetchProfileData();
  }, [id, userType, navigate, userName]);

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('id');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  if (!userData) return <p>Loading...</p>;  // Show loading until data is fetched

  return (
    <div className="profile-container">
      <h2 className="profile-title">Your Profile</h2>
      <div className="profile-box">
        <p><strong>Name:</strong> {userData.Name}</p>
        <p><strong>Email:</strong> {userData.Email}</p>
        {userData.Profile_Picture && (
          <img
            src={`data:image/jpeg;base64,${userData.Profile_Picture}`}
            alt={`${userData.Name}'s profile`}
            className="profile-picture"
          />
        )}
        <p><strong>Academic Details:</strong> {userData.Academic_Details}</p>
        <p><strong>Professional Details:</strong> {userData.Professional_Details}</p>
      </div>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
