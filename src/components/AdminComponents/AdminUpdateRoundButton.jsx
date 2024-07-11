import React from 'react';
import axios from 'axios';

const AdminUpdateRoundButton = ({ URL }) => {
  const handleUpdateRound = async () => {
    try {
      const response = await axios.put(`${URL}/contestants/update-round`);
      alert(response.data.message);
    } catch (error) {
      alert('Error updating round for contestants');
      console.error(error);
    }
  };

  return (
    <div className="admin-actor-standing">
      <h3>Update Round for Active Contestants</h3>
      <p>This will update the round for all active contestants.</p>
      <button onClick={handleUpdateRound}>
        Update Round
      </button>
    </div>
  );
};

export default AdminUpdateRoundButton;
