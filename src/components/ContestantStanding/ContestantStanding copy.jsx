import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContestantStanding = ({ URL }) => {
  const [contestants, setContestants] = useState([]);
  const [updateCount, setUpdateCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [timeoutOver, setTimeoutOver] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [contestEndHandled, setContestEndHandled] = useState(false); // New state variable

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
    setStartTime(Date.now());
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

  const messages = groupedContestants.length === 1 && groupedContestants[0].length <= 10
  ? [`Winner: ${groupedContestants[0][0].name}! Congratulations!`] // Display winner message
  : topThree.map((contestant, index) => {
      if (groupedContestants.length === 1) {
        return `${contestant.name}, is in first! They won!`;
      } else {
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
      }
    });


  useEffect(() => {
    if (timeoutOver && startTime && !contestEndHandled) {
      const handleEndOfContest = async () => {
        console.log("Number of groups:", groupedContestants.length); // Log the number of groups

        // Check if there's only one group left with 10 or fewer contestants
        if (groupedContestants.length === 1 && groupedContestants[0].length <= 10) {
          const remainingContestants = groupedContestants[0];
          const winner = remainingContestants[0];
          setContestants([`${winner.name} is the winner!`]);
          setContestEndHandled(true);
          return;
        }
  
        const allContestants = [].concat(...groupedContestants);
        const inactiveContestants = allContestants.filter(
          contestant => !topThree.includes(contestant)
        );
  
        // Only clear votes if there are more than one group remaining or the remaining group has more than 10 contestants
        if (groupedContestants.length > 1 || groupedContestants[0].length > 10) {
          for (const contestant of inactiveContestants) {
            try {
              await axios.put(`${URL}/contestants/active/${contestant.id}`, { active: 0 });
              console.log(`Contestant ${contestant.name} deactivated successfully!`);
  
            } catch (error) {
              console.error(`Error deactivating or resetting votes for contestant ${contestant.name}:`, error);
            }
          }
  
          // Reset votes for all contestants except the top three
          try {
            await Promise.all(allContestants.map(contestant => {
              if (!topThree.includes(contestant)) {
                return axios.put(`${URL}/contestants/reset-votes/${contestant.id}`);
              }
              return Promise.resolve();
            }));
            console.log(`All votes reset successfully!`);
          } catch (error) {
            console.error(`Error resetting votes for all contestants:`, error);
          }
        }
  
        const updatedContestants = await axios.get(`${URL}/contestants`);
        setContestants(updatedContestants.data);
        setContestEndHandled(true); // Update contestEndHandled
      };
  
      handleEndOfContest();
    }
  }, [timeoutOver, startTime, contestants, groupedContestants, topThree, contestEndHandled]);
  
  useEffect(() => {
    if (startTime) {
      const timerId = setTimeout(() => {
        setTimeoutOver(true);
      }, 1 * 60 * 1000); // 1 minute for testing

      return () => clearTimeout(timerId);
    }
  }, [startTime]);

  useEffect(() => {
    if (!timeoutOver && startTime) {
      const timerDuration = 1 * 60 * 1000; // 1 minute for testing

      const interval = setInterval(() => {
        const now = Date.now();
        const distance = timerDuration - (now - startTime);
        if (distance > 0) {
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setTimeLeft({ hours, minutes, seconds });
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
        Time left: {timeLeft.hours} hours {timeLeft.minutes} minutes {timeLeft.seconds} seconds
      </div>
    </div>
  );
};

export default ContestantStanding;
