import React from 'react';
import axios from 'axios';

const AdminDeactivateNonRankButton = ({ URL, API_KEY }) => {
  const handleDeactivate = async () => {
    try {
      const response = await axios.put(
        `${URL}/contestants/deactivate-non-ranked`,
        {}, // Pass an empty object if there is no request body
        {
          headers: {
            Authorization: `${API_KEY}`,
          },
        }
      );
      alert(response.data.message);
    } catch (error) {
      // Provide more descriptive error handling
      if (error.response) {
        console.error('Error Response:', error.response.data);
        alert(error.response.data.error || 'Failed to deactivate contestants.');
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
      <h3>Deactivate Non-Ranked Contestants</h3>
      <p>Removal of 4th and onwards. They will be deactivated. If there are issues, please do it manually below.</p>
      <button onClick={handleDeactivate}>
        Deactivate Non-Ranked Contestants
      </button>
    </div>
  );
};

export default AdminDeactivateNonRankButton;
