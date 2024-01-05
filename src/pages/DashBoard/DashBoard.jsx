// Dashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import EditDashboard from '../../components/EditDashBoard/EditDashBoard';
import './DashBoard.scss';

export default function Dashboard() {
  const [error, setError] = useState("");
  const [contestants, setContestants] = useState([]);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserDashboard = async () => {
      try {
        if (currentUser) {
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

  const toggleEditing = () => {
    setIsEditing((prevIsEditing) => !prevIsEditing);
  };

  return (
    <div className="dashboard">
      <div className="dashboard__content">
        <h2 className="dashboard__title">Dashboard</h2>

        {/* Contestant Data */}
        <div className="dashboard__user-data">
          {contestants && (
            <div key={contestants.id} className="dashboard__user-details">
              <h3 className="dashboard__user-name">{contestants.name}</h3>
              <p className="dashboard__user-description">{contestants.description}</p>
              <img
                src={contestants.url_photo}
                alt={contestants.name}
                className="dashboard__user-photo"
              />
              <p className="dashboard__user-votes">Votes: {contestants.votes}</p>
            </div>
          )}

          {contestants.url_video && (
            <iframe
              title="Contestant Video"
              width="320"
              height="240"
              src={contestants.url_video.replace("watch?v=", "embed/")}
              allowFullScreen
              className="dashboard__contestant-video"
            ></iframe>
          )}
        </div>

        <button onClick={handleLogout} className="dashboard__logout-button">
          Log Out
        </button>

        {isEditing && (
          <EditDashboard contestantId={contestants.id} toggleEditing={toggleEditing} />
        )}

        <button onClick={toggleEditing} className="dashboard__edit-button">
          {isEditing ? 'Cancel Edit' : 'Edit'}
        </button>

        {error && <p className="dashboard__error">{error}</p>}
      </div>
    </div>
  );
}
