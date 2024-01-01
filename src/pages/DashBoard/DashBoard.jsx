import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [error, setError] = useState("");
  const [contestants, setContestants] = useState([]);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Current User Object:", currentUser);

    const fetchUserDashboard = async () => {
      try {
        if (currentUser) {
          console.log("User ID:", currentUser.uid);
          const response = await axios.get(`http://localhost:8000/users/${currentUser.uid}`);

          const data = response.data;
          setContestants(data.contestant);
        }
      } catch (error) {
        console.error('Error fetching dashboard data: ', error);
        setError('Failed to load dashboard data');
      }
    };

    fetchUserDashboard();
  }, [currentUser]);

  async function handleLogout() {
    setError('');
    try {
      await logout();
      navigate('/login');
    } catch {
      setError('Failed to log out');
    }
  }

  return (
    <div>
      <p>Dashboard is here</p>
      <strong>Email:</strong> {currentUser && currentUser.email}
      <Link to="/update-profile">Update Profile</Link>
   {/* Contestant Data */}
   <div>
      {contestants && (
        <div key={contestants.id}>
          <h3>{contestants.name}</h3>
          <p>{contestants.description}</p>
          <img src={contestants.url_photo} alt={contestants.name} style={{ maxWidth: '200px' }} />
          {contestants.url_video && (
            <iframe
              title="Contestant Video"
              width="320"
              height="240"
              src={contestants.url_video}
              allowFullScreen
            ></iframe>
          )}
          <p>Votes: {contestants.votes}</p>
        </div>
      )}
    </div>

      <button onClick={handleLogout}>Log Out</button>
      {error && <p>{error}</p>}
    </div>
  );
}
