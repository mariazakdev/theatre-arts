import React from 'react';
import axios from 'axios';

const AdminResetVoteTrackerButton = ({ URL, API_KEY }) => {
  const handleResetVoteTracker = async () => {
    try {
      const response = await axios.put(
        `${URL}/votes-tracker/reset-vote-tracker-history`,
        {}, // No payload needed
        {
          headers: {
            Authorization: `${API_KEY}`,
          },
        }
      );
      alert(response.data.message);
    } catch (error) {
      if (error.response) {
        console.error('Error Response:', error.response.data);
        alert(error.response.data.error || 'Failed to reset vote tracker history.');
      } else if (error.request) {
        console.error('No Response:', error.request);
        alert('No response from server. Please try again later.');
      } else {
        console.error('Error:', error.message);
        alert('Unexpected error occurred.');
      }
    }
  };

  return (
    <div className="admin-reset-vote-tracker">
      <h3>Reset Vote Tracker History</h3>
      <p>This will remove all history from the votes tracker table.</p>
      <button onClick={handleResetVoteTracker} className="reset-vote-tracker-button">
        Reset Vote Tracker
      </button>
    </div>
  );
};

export default AdminResetVoteTrackerButton;
