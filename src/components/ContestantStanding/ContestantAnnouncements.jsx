import React, { useState, useEffect } from 'react';
import axios from 'axios';
const URL = process.env.REACT_APP_BACKEND_URL;

const ContestantAnnouncement = ({ actorId }) => {
  const [contestants, setContestants] = useState([]);
  const [numOfContestants , setNumOfContestants] = useState(0);
  const [updateCount, setUpdateCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [timeoutOver, setTimeoutOver] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [contestEndHandled, setContestEndHandled] = useState(false); 
  const [winnerMessages, setWinnerMessages] = useState([]);
  const [otherMessages, setOtherMessages] = useState([]);
console.log('actorId:', actorId);
  useEffect(() => {
    axios.get(`${URL}/contestants`)
      .then(response => {
        const activeContestants = response.data.filter(contestant => contestant.active === 1);
        setContestants(activeContestants);
        setNumOfContestants(activeContestants.length);
        console.log('Contestants:', activeContestants);
      })
      .catch(error => {
        console.error('Error fetching contestants:', error);
      });
  }, [updateCount]);

  const startTimer = () => {
    setStartTime(Date.now());
  };
 
  useEffect(() => {

    if (!contestants.length) return; 
  
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
  
 // Find the contestant object that matches the actorId
 const actorContestant = contestants.find(contestant => contestant.id === actorId);
 winnerMessages.splice(0, winnerMessages.length);


    setWinnerMessages([]);
    setOtherMessages([]);
  
    // if (contestants.length <= 10) {
    //   topThree.forEach((contestant, index) => {
    //     if (index === 0) {
    //       setWinnerMessages(prevMessages => [...prevMessages, `${contestant.name}, is won! CONGRATULATIONS !`]);
    //     } else if (index === 1) {
    //       setWinnerMessages(prevMessages => [...prevMessages, `${contestant.name}, you are second! Well done!`]);
    //     } else if (index === 2) {
    //       setWinnerMessages(prevMessages => [...prevMessages, `${contestant.name}, you are third! Well done!`]);
    //     }
    //   });
    // } else {
    //   topThree.forEach((contestant, index) => {
    //     if (index === 0) {
    //       setOtherMessages(prevMessages => [...prevMessages, `${contestant.name}, is in first! Help them stay there!`]);
    //     } else if (index === 1 || index === 2) {
    //       setOtherMessages(prevMessages => [...prevMessages, `${contestant.name}, you are ${index === 1 ? 'second' : 'third'}! Help them get to first!`]);
    //     }
    //   });
    // }


    if (timeoutOver && startTime && !contestEndHandled) {
      const handleEndOfContest = async () => {
        if (!groupedContestants.length) return null;
  
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
  
        if (groupedContestants.length > 1 || groupedContestants[0].length > 10) {
          for (const contestant of inactiveContestants) {
            try {
              await axios.put(`${URL}/contestants/active/${contestant.id}`, { active: 0 });
              console.log(`Contestant ${contestant.name} deactivated successfully!`);
            } catch (error) {
              console.error(`Error deactivating or resetting votes for contestant ${contestant.name}:`, error);
            }
          }
  
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
        const activeUpdatedContestants = updatedContestants.data.filter(contestant => contestant.active === 1);
        setContestants(activeUpdatedContestants);
        setContestEndHandled(true); // Update contestEndHandled
      };
  
      handleEndOfContest();
    }
  }, [updateCount, timeoutOver, startTime, contestants, contestEndHandled]);
   
console.log('contestants at 138:', contestants);

  useEffect(() => {
    console.log("Setting up timer...");
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


  // useEffect(() => {
  //   console.log('Contestants:', contestants);

  //   if (contestants.length <= 10) {
  //     const topContestant = contestants[0]; // Assuming contestants are sorted by rank
  //     console.log('Top Contestant:', topContestant);

  //     if (topContestant.id === actorId) {
  //       setWinnerMessages([`${topContestant.name}, is won! CONGRATULATIONS !`]);
  //     } else {
  //       setWinnerMessages([]);
  //     }
  //   } else {
  //     const topThreeContestants = contestants.slice(0, 3);
  //     console.log('Top Three Contestants:', topThreeContestants);
  //     if (topThreeContestants.some(contestant => contestant.id === actorId)) {
  //       setOtherMessages([
  //         `${topThreeContestants[0].name}, is in first! Help them stay there!`,
  //         `${topThreeContestants[1].name}, you are second! Help them get to first!`,
  //         `${topThreeContestants[2].name}, you are third! Help them get to first!`
  //       ]);
  //     } else {
  //       setOtherMessages([]);
  //     }
  //   }
  // }, [contestants, actorId]);

  return (
    
    <div>
      
     <p>{winnerMessages}</p>
    </div>
 

  );
};

export default ContestantAnnouncement;
