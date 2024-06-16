import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContestantGroupsRestart.scss';

const ContestantGroupsRestart = ({ URL, API_KEY }) => {
  const [contestants, setContestants] = useState([]);
  const [numOfContestants, setNumOfContestants] = useState(0);
  const [updateCount, setUpdateCount] = useState(0);
  const [contestEndHandled, setContestEndHandled] = useState(false);
  const [ contestantId, setContestantId] = useState(0);


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
  
        // Fetch individual contestant IDs
        activeContestants.forEach(contestant => {
          axios.get(`${URL}/contestants/${contestant.id}`, {
            headers: {
              Authorization: `${API_KEY}`,
            },
          })
            .then(res => {
              // Now you can use the contestant ID for further operations
            })
            .catch(err => {
              console.error(`Error fetching contestant with ID ${contestant.id}:`, err);
            });
        });
      })
      .catch(error => {
        console.error('Error fetching contestants:', error);
      });
  }, [updateCount]);

  // Eliminate contestants not in top 3 of each group
  const handleEndOfContest = async () => {
    try {
      // Assigning contestants to groups of 10
      const groupedContestants = [];
      for (let i = 0; i < contestants.length; i += 10) {
        groupedContestants.push(contestants.slice(i, i + 10));
      }

      // Sorting contestants in each group and getting top three in each group
      const topThreeInEachGroup = groupedContestants.map(group => {
        const sortedGroup = [...group].sort((a, b) => b.votes - a.votes);
        return sortedGroup.slice(0, 3);
      });

      const topThree = [].concat(...topThreeInEachGroup);
      const allContestants = [].concat(...groupedContestants);
      const inactiveContestants = allContestants.filter(contestant => !topThree.includes(contestant));

      // Deactivating contestants not in top three of each group
      await Promise.all(inactiveContestants.map(contestant => {
        return axios.put(`${URL}/contestants/active/${contestant.id}`, { active: 0 }, {
          headers: {
            Authorization: `${API_KEY}`,
          },
        });
      }));

      const updatedContestants = await axios.get(`${URL}/contestants`, {
        headers: {
          Authorization: `${API_KEY}`,
        },
      });
      const activeUpdatedContestants = updatedContestants.data.filter(contestant => contestant.active === 1);
      setContestants(activeUpdatedContestants);
      setContestEndHandled(true);
      setUpdateCount(prevCount => prevCount + 1); // Trigger a re-fetch of contestants
      alert('Contestants updated and new round started!');
    } catch (error) {
      console.error('Error deactivating contestants:', error);
    }
  };


  return (
    <div className='admin-start-timer'>
      <h5>Button starts new round. Deactivates those not in top 3.</h5>
      <button onClick={handleEndOfContest}>Start New Round</button>
 
  
    </div>
  );
};

export default ContestantGroupsRestart;
