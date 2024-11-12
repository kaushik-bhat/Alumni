import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/card'; // Adjust this import based on your project structure
import './Homepage.css';  // Ensure you have this CSS file

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch events data from the backend
  useEffect(() => {
    fetch('http://localhost:5000/api/event')  // Adjusted URL to match API path
      .then(response => response.json())
      .then(data => {
        console.log('Fetched Events:', data);  // Debugging: Log the full response from the backend
        setEvents(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
        setLoading(false);
      });
  }, []);

  // Filter events based on search term
  const filteredEvents = events.filter((event) => {
    const search = searchTerm.toLowerCase();
    return (
      event.Name.toLowerCase().includes(search) ||
      event.Location.toLowerCase().includes(search) ||
      (event.Description && event.Description.toLowerCase().includes(search))
    );
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const time = new Date();
    time.setHours(parseInt(hours));
    time.setMinutes(parseInt(minutes));
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(time);
  };

  // Check if the event image is a valid base64 string
  const isValidBase64 = (str) => {
    const regex = /^data:image\/(jpeg|png|gif);base64,/;
    return regex.test(str);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="header">
        <h1>Upcoming Events</h1>
        <p>Connect, learn, and grow with your alumni community</p>
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>

      <div className="events-grid">
        {filteredEvents.map((event) => {
          // Debugging: Log image and check if it's a valid base64 string
          console.log('Event Image (Base64):', event.Image);  // Debugging: Log image data
          const imageIsValid = isValidBase64(event.Image);

          return (
            <div key={event.Event_ID} className="event-card">
              {/* Image Container */}
              <div className="event-image-container">
                {imageIsValid ? (
                  <img
                    src={`data:image/jpeg;base64,${event.Image}`}  // Explicitly prepend "data:image/jpeg;base64,"
                    alt={event.Name}
                    className="event-image"
                  />
                ) : (
                  <p className="no-image">No valid image available</p>
                )}
              </div>

              <CardHeader>
                <CardTitle>{event.Name}</CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(event.Date)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(event.Time)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{event.Location}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 line-clamp-3">{event.Description}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm text-gray-600">50 attending</span>
                </div>
                <button className="register-button">
                  Register Now
                </button>
              </CardFooter>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
