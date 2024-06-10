import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContestantGroupsRestart.scss';

const ContestantGroupsRestart = ({ URL, API_KEY }) => {
  const [contestants, setContestants] = useState([]);
  const [numOfContestants, setNumOfContestants] = useState(0);
  const [updateCount, setUpdateCount] = useState(0);

  useEffect(() => {
    axios.get(`${URL}/contestants`, {
      headers: {
        Authorization: `${API_KEY}`,
      },
    })
      .then(response => {
        const activeContestants = response.data.filter(contestant => contestant.active === 1);
        setContestants(activeContestants);
        setNumOfContestants(activeContestants.length);
      })
      .catch(error => {
        console.error('Error fetching contestants:', error);
      });
  }, [updateCount]);

  const handleUpdateRound = async () => {
    try {
      await axios.put(`${URL}/contestants/update-round`, {}, {
        headers: {
          Authorization: `${API_KEY}`,
        },
      });

      alert('Round updated successfully for all active contestants!');
      setUpdateCount(prevCount => prevCount + 1); // Trigger a re-fetch of contestants
    } catch (error) {
      console.error('Error updating round:', error);
    }
  };

  return (
    <div className='admin-start-timer'>
      <h5>Button updates round for active contestants.</h5>
      <button onClick={handleUpdateRound}>Update Round</button>
    </div>
  );
};

export default ContestantGroupsRestart;
