import React from 'react';
import axios from 'axios';

const AdminDeactivateNonRankButton = ({URL}) => {
  const handleDeactivate = async () => {
    try {
      const response = await axios.put(`${URL}/contestants/deactivate-non-ranked`);
      alert(response.data.message);
    } catch (error) {
      alert('Error deactivating non-top-3 contestants');
      console.error(error);
    }
  };

  return (
    <div className="admin-actor-standing">
      <h3>Deactivate Non-Ranked Contestants</h3>
    <p>Removal of 4th and onwards. They will be deactivated. If there are issues, please do it manually below</p>
    <button onClick={handleDeactivate}>
      Deactivate Non-Ranked Contestants
    </button>
    </div>
  );
};

export default AdminDeactivateNonRankButton;
