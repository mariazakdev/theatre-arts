import React from 'react';
import axios from 'axios';

const AdminRegroupContestantsButton = ({ URL }) => {
  const handleRegroup = async () => {
    try {
      const response = await axios.put(`${URL}/contestants/regroup-contestants`);
      alert(response.data.message);
    } catch (error) {
      alert('Error regrouping contestants');
      console.error(error);
    }
  };

  return (
    <div className="admin-actor-standing">
      <h3>Regroup Active Contestants</h3>
      <p>This will regroup all active contestants into new groups with 10 contestants each, starting from scratch.</p>
      <button onClick={handleRegroup}>
        Regroup Active Contestants
      </button>
    </div>
  );
};

export default AdminRegroupContestantsButton;
