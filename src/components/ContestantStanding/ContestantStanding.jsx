import React, { useState, useEffect } from 'react';
import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_URL;

const ContestantStanding = () => {
  const [contestants, setContestants] = useState([]);
  const [updateCount, setUpdateCount] = useState(0);

  useEffect(() => {
    // Fetch contestants from your API
    axios.get(`${URL}/contestants`)
      .then(response => {
        setContestants(response.data);
      })
      .catch(error => {
        console.error('Error fetching contestants:', error);
      });
  }, [updateCount]);

  // Group contestants into arrays of 10
  const groupedContestants = [];
  for (let i = 0; i < contestants.length; i += 10) {
    groupedContestants.push(contestants.slice(i, i + 10));
  }

  // Get the top 3 contestants in each group
  const topThreeInEachGroup = groupedContestants.map(group => {
    const sortedGroup = [...group].sort((a, b) => b.votes - a.votes);
    return sortedGroup.slice(0, 3);
  });

  // Flatten the array of top 3 contestants
  const topThree = [].concat(...topThreeInEachGroup);

  // Display messages based on ranking
  const messages = topThree.map((contestant, index) => {
    switch (index) {
      case 0:
        return `${contestant.name}, is in first! Help them stay there!`;
      case 1:
        return `${contestant.name}, you are second! Help them get to first!`;
      case 2:
        return `${contestant.name}, you are third! Help them get to first!`;
      default:
        return '';
    }
  });

  // Timer to trigger update every 7 days
  useEffect(() => {
    const timerId = setInterval(() => {
      setUpdateCount(prevCount => prevCount + 1);
    }, 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds

    return () => clearInterval(timerId);
  }, []);

  // Render the messages
  return (
    <div>
      {messages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
    </div>
  );
};

export default ContestantStanding;
