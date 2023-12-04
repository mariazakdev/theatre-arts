import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import "./DashBoard.scss";

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
    <div className="dashboard">
    <p className="dashboard__title">Dashboard is here</p>
    <strong className="dashboard__email-label">Email:</strong>
    <span className="dashboard__email">{currentUser && currentUser.email}</span>
    <Link to="/update-profile" className="dashboard__profile-link">Update Profile</Link>
    
    {contestants.map(contestant => (
      <div key={contestant.id} className="contestant">
        <h3 className="contestant__name">{contestant.name}</h3>
        <p className="contestant__description">{contestant.description}</p>
        <img src={contestant.url_photo} alt={contestant.name} className="contestant__photo" />
        {contestant.url_video && (
          <iframe
            title="Contestant Video"
            className="contestant__video"
            src={contestant.url_video}
            allowFullScreen
          ></iframe>
        )}
        <p className="contestant__votes">Votes: {contestant.votes}</p>
      </div>
    ))}
  
    <button onClick={handleLogout} className="dashboard__logout-button">Log Out</button>
    {error && <p className="dashboard__error">{error}</p>}
  </div>
  );
}
