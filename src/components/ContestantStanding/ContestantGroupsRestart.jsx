// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './ContestantStanding.scss';

// const ContestantStanding = ({ URL , API_KEY}) => {
//   const [contestants, setContestants] = useState([]);
//   const [numOfContestants , setNumOfContestants] = useState(0);
//   const [updateCount, setUpdateCount] = useState(0);
//   const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
//   const [timeoutOver, setTimeoutOver] = useState(false);
//   const [startTime, setStartTime] = useState(null);
//   const [contestEndHandled, setContestEndHandled] = useState(false); 
//   const [winnerMessages, setWinnerMessages] = useState([]);
//   const [otherMessages, setOtherMessages] = useState([]);

//   useEffect(() => {
//     axios.get(`${URL}/contestants`, 
//     {
//       headers: {
//         Authorization: `${API_KEY}`,
//       },
//     }
    
//     )
//       .then(response => {
//         const activeContestants = response.data.filter(contestant => contestant.active === 1);
//         setContestants(activeContestants);
//         setNumOfContestants(activeContestants.length);
//       })
//       .catch(error => {
//         console.error('Error fetching contestants:', error);
//       });
//   }, [updateCount]);

//   const startTimer = () => {
//     setStartTime(Date.now());
//   };

//   useEffect(() => {
//     if (!contestants.length) return; 
  
//     // Assigning contestants to groups of 10
//     const groupedContestants = [];
//     for (let i = 0; i < contestants.length; i += 10) {
//       groupedContestants.push(contestants.slice(i, i + 10));
//     }
  
//     // Sorting contestants in each group and getting top three in each group
//     const topThreeInEachGroup = groupedContestants.map(group => {
//       const sortedGroup = [...group].sort((a, b) => b.votes - a.votes);
//       return sortedGroup.slice(0, 3);
//     });
  
//     const topThree = [].concat(...topThreeInEachGroup);
  
//     const winnerMessages = [];
//     const otherMessages = [];
  
//     if (contestants.length <= 10) {
//       topThree.forEach((contestant, index) => {
//         switch (index) {
//           case 0:
//             winnerMessages.push(`${contestant.name}, is won! CONGRATULATIONS !`);
//             break;
//           case 1:
//             winnerMessages.push(`${contestant.name}, you are second! Well done!`);
//             break;
//           case 2:
//             winnerMessages.push(`${contestant.name}, you are third! Well done!`);
//             break;
//           default:
//             break;
//         }
//       });
//     } else {
//       // Messages for multiple groups
//       topThree.forEach((contestant, index) => {
//         switch (index) {
//           case 0:
//             otherMessages.push(`${contestant.name}, is in first! Help them stay there!`);
//             break;
//           case 1:
//             otherMessages.push(`${contestant.name}, you are second! Help them get to first!`);
//             break;
//           case 2:
//             otherMessages.push(`${contestant.name}, you are third! Help them get to first!`);
//             break;
//           default:
//             break;
//         }
//       });
//     }
  
//     if (timeoutOver && startTime && !contestEndHandled) {
//       const handleEndOfContest = async () => {
//         if (!groupedContestants.length) return null;
  
//         if (groupedContestants.length === 1 && groupedContestants[0].length <= 10) {
//           const remainingContestants = groupedContestants[0];
//           const winner = remainingContestants[0];
//           setContestants([`${winner.name} is the winner!`]);
//           setContestEndHandled(true);
//           return;
//         }
  
//         const allContestants = [].concat(...groupedContestants);
//         const inactiveContestants = allContestants.filter(
//           contestant => !topThree.includes(contestant)
//         );
  
//         if (groupedContestants.length > 1 || groupedContestants[0].length > 10) {
//           for (const contestant of inactiveContestants) {
//             try {
//               await axios.put(`${URL}/contestants/active/${contestant.id}`, { active: 0 }, 
//               {
//                 headers: {
//                   Authorization: `${API_KEY}`,
//                 },
//               }
              
//               );
//             } catch (error) {
//               console.error(`Error deactivating or resetting votes for contestant ${contestant.name}:`, error);
//             }
//           }
  
//           try {
//             await Promise.all(allContestants.map(contestant => {
//               if (!topThree.includes(contestant)) {
//                 return axios.put(`${URL}/contestants/reset-votes/${contestant.id}`,
                
//                 {
//                   headers: {
//                     Authorization: `${API_KEY}`,
//                   },
//                 }
//                 );
//               }
//               return Promise.resolve();
//             }));
//           } catch (error) {
//             console.error(`Error resetting votes for all contestants:`, error);
//           }
//         }
  
//         const updatedContestants = await axios.get(`${URL}/contestants`, 
//         {
//           headers: {
//             Authorization: `${API_KEY}`,
//           },
//         }
        
//         );
//         const activeUpdatedContestants = updatedContestants.data.filter(contestant => contestant.active === 1);
//         setContestants(activeUpdatedContestants);
//         setContestEndHandled(true); // Update contestEndHandled
//       };
  
//       handleEndOfContest();
//     }
//   }, [updateCount, timeoutOver, startTime, contestants, contestEndHandled]);
  

//   useEffect(() => {
//     if (startTime) {
//       const timerId = setTimeout(() => {
//         setTimeoutOver(true);
//       }, 1 * 60 * 1000); // 1 minute for testing

//       return () => clearTimeout(timerId);
//     }
//   }, [startTime]);

//   useEffect(() => {
//     if (!timeoutOver && startTime) {
//       const timerDuration = 1 * 60 * 1000; // 1 minute for testing

//       const interval = setInterval(() => {
//         const now = Date.now();
//         const distance = timerDuration - (now - startTime);
//         if (distance > 0) {
//           const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//           const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//           const seconds = Math.floor((distance % (1000 * 60)) / 1000);
//           setTimeLeft({ hours, minutes, seconds });
//         } else {
//           clearInterval(interval);
//         }
//       }, 1000);
//       return () => clearInterval(interval);
//     }
//   }, [timeoutOver, startTime]);

//   return (
//     <div className='admin-start-timer'>
//       <button onClick={startTimer}>Start Timer Till Next Round</button>
//       {/* {contestants.length > 0 && contestants.map((contestant, index) => (
//         <p key={index}>{contestant.name}</p>
//       ))}
//       {contestants.length <= 10 ? (
//         <div>
   

// {winnerMessages.map((message, index) => (
//         <p key={index}>{message}</p>
//       ))}
//         </div>
//       ) : (
//         <div>
//        {otherMessages.map((message, index) => (
//         <p key={index}>{message}</p>
//       ))}
//         </div>
//       )} */}
//       <div>
//         Time left: {timeLeft.hours} hours {timeLeft.minutes} minutes {timeLeft.seconds} seconds
//       </div>
//     </div>
//   );
// };

// export default ContestantStanding;









// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './ContestantGroupsRestart.scss';

// const ContestantGroupsRestart = ({ URL, API_KEY }) => {
//   const [contestants, setContestants] = useState([]);
//   const [numOfContestants, setNumOfContestants] = useState(0);
//   const [updateCount, setUpdateCount] = useState(0);
//   const [contestEndHandled, setContestEndHandled] = useState(false);

//   useEffect(() => {
//     axios.get(`${URL}/contestants`, {
//       headers: {
//         Authorization: `${API_KEY}`,
//       },
//     })
//       .then(response => {
//         const activeContestants = response.data.filter(contestant => contestant.active === 1);
//         setContestants(activeContestants);
//         setNumOfContestants(activeContestants.length);
//       })
//       .catch(error => {
//         console.error('Error fetching contestants:', error);
//       });
//   }, [updateCount]);

//   const handleEndOfContest = async () => {
//     try {
//       // Assigning contestants to groups of 10
//       const groupedContestants = [];
//       // for (let i = 0; i < contestants.length; i += 10) {
//         for (let i = 0; i < contestants.length; i += 4) {

//         // groupedContestants.push(contestants.slice(i, i + 10));
//         groupedContestants.push(contestants.slice(i, i + 4));
//         // 4 is for testing. production will be 10

//       }

//       // Sorting contestants in each group and getting top three in each group
//       const topThreeInEachGroup = groupedContestants.map(group => {
//         const sortedGroup = [...group].sort((a, b) => b.votes - a.votes);
//         return sortedGroup.slice(0, 3);
//       });

//       const topThree = [].concat(...topThreeInEachGroup);

//       const allContestants = [].concat(...groupedContestants);
//       const inactiveContestants = allContestants.filter(contestant => !topThree.includes(contestant));

//       // Deactivating contestants not in top three of each group
//       await Promise.all(inactiveContestants.map(contestant => {
//         return axios.put(`${URL}/contestants/active/${contestant.id}`, { active: 0 }, {
//           headers: {
//             Authorization: `${API_KEY}`,
//           },
//         });
//       }));

//       const updatedContestants = await axios.get(`${URL}/contestants`, {
//         headers: {
//           Authorization: `${API_KEY}`,
//         },
//       });
//       const activeUpdatedContestants = updatedContestants.data.filter(contestant => contestant.active === 1);
//       setContestants(activeUpdatedContestants);
//       setContestEndHandled(true);
//       setUpdateCount(prevCount => prevCount + 1); // Trigger a re-fetch of contestants
//       alert('Contestants updated and new round started!');

//     } catch (error) {
//       console.error('Error deactivating contestants:', error);
//     }
//   };

//   return (
//     <div className='admin-start-timer'>
//       <h5>Button starts new round. Deactivates those not in top 3.</h5>
//       <button onClick={handleEndOfContest}>Start New Round</button>
//     </div>
//   );
// };

// export default ContestantGroupsRestart;


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
      for (let i = 0; i < contestants.length; i += 6) {
        groupedContestants.push(contestants.slice(i, i + 6));
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
