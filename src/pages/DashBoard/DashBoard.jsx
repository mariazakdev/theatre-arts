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
        // Add a check to ensure currentUser exists before attempting to fetch data
        if (currentUser) {
          const response = await fetch(`${backendURL}/uploads/${currentUser.uid}`); // Fetch user-specific data
          const data = await response.json();
          setContestants(data);
        }
      } catch (error) {
        console.error('Error retrieving contestants: ', error);
        setError('Failed to retrieve contestants');
      }
    };

    if (currentUser) {
      fetchContestants();
    }
  }, [currentUser, backendURL]);

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
            
            <iframe
            title="Contestant Video"
            width="320"
            height="240"
            src={contestant.url_video}
            allowFullScreen
          ></iframe>

          )}
          <p>{contestant.description}</p>
        </div>
      ))}
      <button onClick={handleLogout}> Log Out</button>
      {error && <p>{error}</p>}
    </div>
  );
}
