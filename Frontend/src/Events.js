// src/Events.js
import React, { useEffect, useState } from 'react';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/events')
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error('Error fetching events data:', error));
  }, []);

  const filteredEvents = events.filter((event) => {
    const search = searchTerm.toLowerCase();
    return (
      event.Name.toLowerCase().includes(search) ||
      event.Location.toLowerCase().includes(search) ||
      event.Description.toLowerCase().includes(search) ||
      (event.Date && event.Date.includes(search))
    );
  });

  return (
    <div className="events-container">
      <div className="events-header">
        <div className="events-title-container">
          <img src="pesu.png" alt="PESU Logo" className="events-logo" />
          <h1 className="events-title">PESU EVENTS</h1>
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="events-search"
        />
      </div>
      <div className="events-grid">
        {filteredEvents.map((event) => (
          <div key={event.Event_ID} className="events-card">
            <div className="events-card-content">
              <h2>{event.Name}</h2>
              <p><strong>Date:</strong> {new Date(event.Date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {event.Time}</p>
              <p><strong>Location:</strong> {event.Location}</p>
              <p><strong>Description:</strong> {event.Description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
