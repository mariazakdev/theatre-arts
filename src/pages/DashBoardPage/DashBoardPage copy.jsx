import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import VideoPlayer from '../../components/VideoEmbed/VideoEmbed'; 
import EditDashboard from '../../components/EditDashBoard/EditDashBoard';
import './DashBoardPage.scss';

export default function Dashboard({URL}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); 
  const [contestants, setContestants] = useState([]);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserDashboard = async () => {
      try {
        if (currentUser) {
          const response = await axios.get(`${URL}/users/${currentUser.uid}`);
          const data = response.data;

          if (data.contestant) {
            setContestants(data.contestant);
          } else {
            setError('No contestant found for this user');
            navigate('/contestant/enter');
            return; 
          }
        } else {
          setError('User not found');
          navigate('/');
          return; 
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data: ', error);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchUserDashboard();
  }, [currentUser, navigate]);

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

  if (loading) {
    return <p>Loading...</p>;
  }
  const updateContestantData = async () => {
    try {
      const response = await axios.get(`${URL}/users/${currentUser.uid}`);
      const data = response.data;

      if (data.contestant) {
        setContestants(data.contestant);
      } else {
        setError('No contestant found for this user');
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching updated contestant data: ', error);
      setError('Failed to load updated contestant data');
    }
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
 <VideoPlayer videoUrl={contestants.url_video.replace("watch?v=", "embed/")}/>
   
        </div>

        <button onClick={handleLogout} className="dashboard__logout-button">
          Log Out
        </button>

        {isEditing && (
          <EditDashboard URL={URL} contestantId={contestants.id} toggleEditing={toggleEditing} updateContestantData={updateContestantData} />
        )}
        <button onClick={toggleEditing} className="dashboard__edit-button">
          {isEditing ? 'Cancel Edit' : 'Edit'}
        </button>

        {error && <p className="dashboard__error">{error}</p>}
      </div>
    </div>
  );
}
