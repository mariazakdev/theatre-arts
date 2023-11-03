import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard({backendURL}) {
  const [error, setError] = useState("");
  const [contestants, setContestants] = useState([]);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    setError('');
    try {
      await logout();
      navigate('/login');
    } catch {
      setError('Failed to log out');
    }
  }

  // Fetch all contestants
  useEffect(() => {
    const fetchContestants = async () => {
      try {
        const response = await fetch(`${backendURL}/contestants`); // backendURL should be defined to point to your server
        const data = await response.json();
        setContestants(data);
      } catch (error) {
        console.error('Error retrieving contestants: ', error);
        setError('Failed to retrieve contestants');
      }
    };

    fetchContestants();
  }, []);

  return (
    <div>
      <p>Dashboard is here</p>
      <strong>Email:</strong> {currentUser && currentUser.email}
      <Link to="/update-profile">
        Update Profile
      </Link>
      {contestants.map(contestant => (
        <div key={contestant.id}>
          <img src={contestant.signedPhotoUrl} alt={contestant.name} />
          {contestant.url_video && (
            <video width="320" height="240" controls>
              <source src={contestant.url_video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          <p>{contestant.description}</p>
        </div>
      ))}
      <button onClick={handleLogout}> Log Out</button>
      {error && <p>{error}</p>}
    </div>
  );
}
