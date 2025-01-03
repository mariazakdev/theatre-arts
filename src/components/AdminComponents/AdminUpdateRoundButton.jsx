// import React from 'react';
// import axios from 'axios';

// const AdminUpdateRoundButton = ({ URL }) => {
//   const handleUpdateRound = async () => {
//     try {
//       const response = await axios.put(`${URL}/contestants/update-round`);
//       alert(response.data.message);
//     } catch (error) {
//       alert('Error updating round for contestants');
//       console.error(error);
//     }
//   };

//   return (
//     <div className="admin-actor-standing">
//       <h3>Update Round for Active Contestants</h3>
//       <p>This will update the round for all active contestants.</p>
//       <button onClick={handleUpdateRound}>
//         Update Round
//       </button>
//     </div>
//   );
// };

// export default AdminUpdateRoundButton;
import React, { useState } from 'react';
import axios from 'axios';

const AdminUpdateRoundButton = ({ URL, API_KEY }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateRound = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(`${URL}/contestants/update-round`, {}, {
        headers: {
          Authorization: `${API_KEY}`,
        },
      });

      if (response.status === 200) {
        alert('Round updated successfully!');
      } else {
        alert('Failed to update round.');
      }
    } catch (error) {
      console.error('Error updating round:', error);
      alert('Error updating round.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-update-round">
      <h3>Update Round</h3>
      <p>This will increment the round for all active contestants.</p>
      <button onClick={handleUpdateRound} disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update Round'}
      </button>
    </div>
  );
};

export default AdminUpdateRoundButton;
