import React from 'react';
import axios from 'axios';

const AdminRegroupContestantsButton = ({ URL, API_KEY }) => {
  const handleRegroup = async () => {
    try {
      const response = await axios.put(
        `${URL}/contestants/regroup-contestants`,
        {}, // No payload, so we send an empty object
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
        alert(error.response.data.error || 'Failed to regroup contestants.');
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
    <div className="admin-actor-standing">
      <h3>Regroup Active Contestants</h3>
      <p>
        This will regroup all active contestants into new groups with 10
        contestants each, starting from scratch.
      </p>
      <button onClick={handleRegroup}>
        Regroup Active Contestants
      </button>
    </div>
  );
};

export default AdminRegroupContestantsButton;
