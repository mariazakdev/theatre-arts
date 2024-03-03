import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContestantStanding = ({ URL }) => {
  const [contestants, setContestants] = useState([]);
  const [updateCount, setUpdateCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0 });

  useEffect(() => {
    axios.get(`${URL}/contestants`)
      .then(response => {
        setContestants(response.data);
      })
      .catch(error => {
        console.error('Error fetching contestants:', error);
      });
  }, [updateCount]);

  const groupedContestants = [];
  for (let i = 0; i < contestants.length; i += 10) {
    groupedContestants.push(contestants.slice(i, i + 10));
  }

  const topThreeInEachGroup = groupedContestants.map(group => {
    const sortedGroup = [...group].sort((a, b) => b.votes - a.votes);
    return sortedGroup.slice(0, 3);
  });

  const topThree = [].concat(...topThreeInEachGroup);

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

  useEffect(() => {
    const timerId = setInterval(() => {
      setUpdateCount(prevCount => prevCount + 1);
      handleInactiveContestants(); // Check inactive contestants after each update
    }, 4 * 60 * 60 * 1000); // 4 hours in milliseconds

    return () => clearInterval(timerId);
  }, []);

  const handleInactiveContestants = () => {
    const allContestants = [].concat(...groupedContestants);
    const inactiveContestants = allContestants.filter(contestant => !topThree.includes(contestant));
    inactiveContestants.forEach(contestant => {
      if (contestant.active === 1) {
        axios.put(`${URL}/contestants/active/${contestant.id}`, { active: 0 })
          .then(() => {
            console.log(`Contestant ${contestant.name} deactivated successfully!`);
          })
          .catch(error => {
            console.error(`Error deactivating contestant ${contestant.name}:`, error);
          });
      }
    });
  };

  // Calculate remaining time in hours and minutes
  useEffect(() => {
    const timerDuration = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
    const currentTime = new Date().getTime();
    const endTime = currentTime + timerDuration;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft({ hours, minutes });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {messages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
      <div>
        Time left: {timeLeft.hours} hours {timeLeft.minutes} minutes
      </div>
    </div>
  );
};

export default ContestantStanding;
