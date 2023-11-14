import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard({backendURL}) {

  const [error, setError] = useState("");
  const [contestants, setContestants] = useState([]);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDashboard = async () => {
      try {
        const token = await currentUser.getIdToken();
        const response = await fetch(`http://localhost:8000/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        setContestants(data.contestants);
      } catch (error) {
        console.error('Error fetching dashboard data: ', error);
        setError('Failed to load dashboard data');
      }
    };

    if (currentUser) {
      fetchUserDashboard();
    }
  }, [currentUser, backendURL]);


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
      {contestants.map(contestant => (
        <div key={contestant.id}>
          <h3>{contestant.name}</h3>
          <p>{contestant.description}</p>
          <img src={contestant.url_photo} alt={contestant.name} style={{ maxWidth: '200px' }} />
          {contestant.url_video && (
            <iframe
              title="Contestant Video"
              width="320"
              height="240"
              src={contestant.url_video}
              allowFullScreen
            ></iframe>
          )}
          <p>Votes: {contestant.votes}</p>
        </div>
      ))}
      <button onClick={handleLogout}>Log Out</button>
      {error && <p>{error}</p>}
    </div>
  );
}
