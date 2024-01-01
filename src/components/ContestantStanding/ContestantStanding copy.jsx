import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContestantStanding = () => {
  const [contestants, setContestants] = useState([]);

  // Group contestants into arrays of 10
  const groupedContestants = [];
  for (let i = 0; i < contestants.length; i += 10) {
    groupedContestants.push(contestants.slice(i, i + 10));
  }

  // Sort contestants by votes in descending order
  const sortedContestants = [...contestants].sort((a, b) => b.votes - a.votes);

  // Get the top 3 contestants
  const topThree = sortedContestants.slice(0, 3);

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