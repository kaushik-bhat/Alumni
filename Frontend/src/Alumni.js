// src/Alumni.js
import React, { useEffect, useState } from 'react';
import './Alumni.css';

const Alumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/alumni')
      .then(response => response.json())
      .then(data => setAlumni(data))
      .catch(error => console.error('Error fetching alumni data:', error));
  }, []);

  // Filter alumni based on search term
  const filteredAlumni = alumni.filter(alum => {
    const search = searchTerm.toLowerCase();
    return (
      alum.Name.toLowerCase().includes(search) ||
      alum.Graduation_Year.toString().includes(search) ||
      alum.Profession.toLowerCase().includes(search) ||
      (alum.Academic_Details && alum.Academic_Details.toLowerCase().includes(search)) ||
      (alum.Professional_Details && alum.Professional_Details.toLowerCase().includes(search))
    );
  });

  return (
    <div className="alumni-container">
      <div className="alumni-header">
      <div className="alumni-title-container">
          <img src="pesu.png" alt="PESU Logo" className="alumni-logo" />
          <h1 className="alumni-title">PESU ALUMNI</h1>
        </div>
        <input
          type="text"
          placeholder="Search...."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="alumni-search"
        />
      </div>
      <div className="alumni-grid">
        {filteredAlumni.map((alum) => (
          <div key={alum.Alumni_ID} className="alumni-card">
            {alum.Profile_Picture && (
              <img
                src={`data:image/jpeg;base64,${alum.Profile_Picture}`}
                alt={`${alum.Name}'s Profile`}
                className="alumni-image"
              />
            )}
            <h2>{alum.Name}</h2>
            <p><strong>Graduation Year:</strong> {alum.Graduation_Year}</p>
            <p><strong>Profession:</strong> {alum.Profession}</p>
            <p><strong>Academic Details:</strong> {alum.Academic_Details}</p>
            <p><strong>Professional Details:</strong> {alum.Professional_Details}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alumni;
