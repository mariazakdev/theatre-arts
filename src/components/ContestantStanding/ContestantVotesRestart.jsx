import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContestantGroupsRestart.scss';

const ContestantVotesRestart = ({ URL, API_KEY }) => {
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

  const handleResetVotes = async () => {
    try {
      const response = await axios.put(`${URL}/contestants/reset-votes`, {}, {
        headers: {
          Authorization: `${API_KEY}`,
        },
      });
      if (response.status === 200) {
        alert('Votes reset successfully for active contestants!');
        setUpdateCount(prevCount => prevCount + 1); // Trigger a re-fetch of contestants
      } else {
        alert('Failed to reset votes');
      }
    } catch (error) {
      console.error('Error resetting votes:', error);
      alert('Error resetting votes');
    }
  };

  return (
    <div className='admin-start-timer'>
      <h5>Button resets votes to 0 for active contestants.</h5>
      <button onClick={handleResetVotes}>Reset Votes</button>
    </div>
  );
};

export default ContestantVotesRestart;