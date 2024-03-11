import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContestantStanding = ({ URL }) => {
  const [contestants, setContestants] = useState([]);
  const [updateCount, setUpdateCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [timeoutOver, setTimeoutOver] = useState(false);
  const [startTime, setStartTime] = useState(null);

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

  // useEffect(() => {
  //   if (timeoutOver && startTime) {
  //     const handleInactiveContestants = async () => {
  //       const allContestants = [].concat(...groupedContestants);
  //       const inactiveContestants = allContestants.filter(
  //         contestant => !topThree.includes(contestant)
  //       );

  //       for (const contestant of inactiveContestants) {
  //         try {
  //           await axios.put(`${URL}/contestants/active/${contestant.id}`, { active: 0 });
  //           console.log(`Contestant ${contestant.name} deactivated successfully!`);

  //           await axios.put(`${URL}/contestants/reset-votes/${contestant.id}`);
  //           console.log(`Votes reset for contestant ${contestant.name} successfully!`);
  //         } catch (error) {
  //           console.error(`Error deactivating or resetting votes for contestant ${contestant.name}:`, error);
  //         }
  //       }

  //       const updatedContestants = await axios.get(`${URL}/contestants`);
  //       setContestants(updatedContestants.data);
  //     };

  //     handleInactiveContestants();
  //   }
  // }, [timeoutOver, startTime]);


  useEffect(() => {
    if (timeoutOver && startTime) {
      const handleInactiveContestants = async () => {
        const allContestants = [].concat(...groupedContestants);
        const inactiveContestants = allContestants.filter(
          contestant => !topThree.includes(contestant)
        );
  
        for (const contestant of inactiveContestants) {
          try {
            await axios.put(`${URL}/contestants/active/${contestant.id}`, { active: 0 });
            console.log(`Contestant ${contestant.name} deactivated successfully!`);

          } catch (error) {
            console.error(`Error deactivating or resetting votes for contestant ${contestant.name}:`, error);
          }
        }
  
        // Reset votes for all contestants
        try {
          await Promise.all(allContestants.map(contestant =>
            axios.put(`${URL}/contestants/reset-votes/${contestant.id}`)
          ));
          console.log(`All votes reset successfully!`);
        } catch (error) {
          console.error(`Error resetting votes for all contestants:`, error);
        }
  
        const updatedContestants = await axios.get(`${URL}/contestants`);
        setContestants(updatedContestants.data);
      };
  
      handleInactiveContestants();
    }
  }, [timeoutOver, startTime]);
  
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
