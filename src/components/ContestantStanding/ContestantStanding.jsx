import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContestantStanding = ({ URL }) => {
  const [contestants, setContestants] = useState([]);
  const [updateCount, setUpdateCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0 });
  const [timeoutOver, setTimeoutOver] = useState(false); // State to track if timeout is over
  const [startTime, setStartTime] = useState(null); // State to track the start time

  useEffect(() => {
    axios.get(`${URL}/contestants`)
      .then(response => {
        setContestants(response.data);
      })
      .catch(error => {
        console.error('Error fetching contestants:', error);
      });
  }, [updateCount]);

  const startTimer = () => {
    setStartTime(Date.now()); // Set the start time when the button is clicked
  };

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
        axios.put(`${URL}/contestants/vote/${contestant.id}`, { votes: 0 }) // Reset votes
          .then(() => {
            console.log(`Votes reset for contestant ${contestant.name} successfully!`);
          })
          .catch(error => {
            console.error(`Error resetting votes for contestant ${contestant.name}:`, error);
          });
      }
    });
  };

  useEffect(() => {
    if (startTime) {
      const timerId = setTimeout(() => {
        setTimeoutOver(true); // Set timeout over flag to true after timer ends
        handleInactiveContestants(); // Handle inactive contestants
      }, 5 * 60 * 1000); // 5 minutes for testing

      return () => clearTimeout(timerId); // Clear the timer on component unmount
    }
  }, [startTime]);

  useEffect(() => {
    if (!timeoutOver && startTime) {
      const timerDuration = 5 * 60 * 1000; // 5 minutes for testing

      const interval = setInterval(() => {
        const now = Date.now();
        const distance = timerDuration - (now - startTime);
        if (distance > 0) {
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft({ hours, minutes });
        } else {
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeoutOver, startTime]);

  return (
    <div>
      <button onClick={startTimer}>Start Timer</button>
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
