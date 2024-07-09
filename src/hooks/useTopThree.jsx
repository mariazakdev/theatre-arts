
// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const API_KEY = process.env.REACT_APP_API_KEY;
// const URL = process.env.REACT_APP_BACKEND_URL;

// function useTopThree(round_number) {
//     const [topThree, setTopThree] = useState([]);
//     const [error, setError] = useState(null);
//     const [groups, setGroups] = useState([]);

//     useEffect(() => {
//         const fetchTopThree = async () => {
//             try {
//                 const response = await axios.get(`${URL}/contestants`, {
//                     params: { round: round_number },
//                     headers: { Authorization: `${API_KEY}` },
//                 });
//                 const contestants = response.data;
//                 console.log("CONTESTANTS", contestants);

//                 // Group contestants by group_number
//                 const groupedContestants = groupContestantsByGroupNumber(contestants);

//                 // Sort contestants within each group and create announcements
//                 const updatedGroups = {};
//                 Object.keys(groupedContestants).forEach(group => {
//                     updatedGroups[group] = groupedContestants[group].sort((a, b) => b.votes - a.votes);
//                     updatedGroups[group] = updatedGroups[group].map((contestant, index) => {
//                         let announce = '';
//                         if (contestants.length <= 12) {
//                             switch (index) {
//                                 case 0:
//                                     announce = `${contestant.name} has won. Congratulations!`;
//                                     break;
//                                 case 1:
//                                     announce = `${contestant.name}, is second in the final result.`;
//                                     break;
//                                 case 2:
//                                     announce = `${contestant.name}, is third in the final result.`;
//                                     break;
//                                 default:
//                                     announce = '';
//                             }
//                         } else {
//                             switch (index) {
//                                 case 0:
//                                     announce = `${contestant.name}, is in first! Help them stay there!`;
//                                     break;
//                                 case 1:
//                                     announce = `${contestant.name}, is currently second! Help them get to first!`;
//                                     break;
//                                 case 2:
//                                     announce = `${contestant.name}, is currently third! Help them get to first!`;
//                                     break;
//                                 default:
//                                     announce = '';
//                             }
//                         }
//                         return { ...contestant, announce };
//                     });
//                 });

//                 // Extract top three contestants across all groups for final announcement
//                 const allContestants = Object.values(updatedGroups).flat();
//                 const sortedAllContestants = allContestants.sort((a, b) => b.votes - a.votes);
//                 const topThreeContestants = sortedAllContestants.slice(0, 3).map((contestant, index) => {
//                     let announce = '';
//                     switch (index) {
//                         case 0:
//                             announce = `${contestant.name} has won. Congratulations!`;
//                             break;
//                         case 1:
//                             announce = `${contestant.name}, is second in the final result.`;
//                             break;
//                         case 2:
//                             announce = `${contestant.name}, is third in the final result.`;
//                             break;
//                         default:
//                             announce = '';
//                     }
//                     return { ...contestant, announce };
//                 });

//                 setTopThree(topThreeContestants);
//                 setGroups(updatedGroups);
//             } catch (err) {
//                 setError(err);
//             }
//         };

//         fetchTopThree();
//     }, [round_number]);

//     const groupContestantsByGroupNumber = (contestants) => {
//         const groupMap = {};
//         contestants.forEach(contestant => {
//             const group = contestant.group_number || 'No Group';
//             if (!groupMap[group]) {
//                 groupMap[group] = [];
//             }
//             groupMap[group].push(contestant);
//         });
//         return groupMap;
//     };

//     console.log("GROUPS", groups);
//     console.log("TOP THREE", topThree);
//     console.log("ERROR", error);

//     return { topThree, error, groups };
// }

// export default useTopThree;

// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const API_KEY = process.env.REACT_APP_API_KEY;
// const URL = process.env.REACT_APP_BACKEND_URL;

// function useTopThree(round_number) {
//     const [groupedContestants, setGroupedContestants] = useState([]);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchContestants = async () => {
//             try {
//                 const response = await axios.get(`${URL}/contestants`, {
//                     params: { round: round_number },
//                     headers: { Authorization: API_KEY },
//                 });
//                 const contestants = response.data;

//                 // Filter only active contestants
//                 const activeContestants = contestants.filter(contestant => contestant.active === 1);

//                 // Initialize a map to group active contestants by group_number
//                 const groupsMap = {};

//                 activeContestants.forEach(contestant => {
//                     if (!groupsMap[contestant.group_number]) {
//                         groupsMap[contestant.group_number] = [];
//                     }
//                     groupsMap[contestant.group_number].push(contestant);
//                 });

//                 // Convert the map to an array of arrays
//                 const groupedContestantsArray = Object.values(groupsMap);

//                 // Sort each group by votes in descending order
//                 groupedContestantsArray.forEach(group => {
//                     group.sort((a, b) => b.votes - a.votes);
//                 });

//                 setGroupedContestants(groupedContestantsArray);
//             } catch (err) {
//                 setError(err);
//             }
//         };

//         fetchContestants();
//     }, [round_number]);

//     return { groupedContestants, error };
// }

// export default useTopThree;

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_API_KEY;
const URL = process.env.REACT_APP_BACKEND_URL;

function useTopThree(round_number) {
    const [groupedContestants, setGroupedContestants] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContestants = async () => {
            try {
                const response = await axios.get(`${URL}/contestants`, {
                    params: { round: round_number },
                    headers: { Authorization: API_KEY },
                });
                const contestants = response.data;

                // Filter only active contestants
                const activeContestants = contestants.filter(contestant => contestant.active === 1);

                // Initialize a map to group active contestants by group_number
                const groupsMap = {};

                activeContestants.forEach(contestant => {
                    if (!groupsMap[contestant.group_number]) {
                        groupsMap[contestant.group_number] = [];
                    }
                    groupsMap[contestant.group_number].push(contestant);
                });

                // Convert the map to an array of arrays
                const groupedContestantsArray = Object.values(groupsMap);

                // Sort each group by votes in descending order and add announcements
                groupedContestantsArray.forEach(group => {
                    group.sort((a, b) => b.votes - a.votes);
                    group.forEach((contestant, index) => {
                        let announce = '';
                        if (index === 0) {
                            announce = `${contestant.name}, is in first! Help them stay there!`;
                        } else if (index === 1) {
                            announce = `${contestant.name}, is currently second! Help them get to first!`;
                        } else if (index === 2) {
                            announce = `${contestant.name}, is currently third! Help them get to first!`;
                        }
                        contestant.announce = announce;
                    });
                });

                setGroupedContestants(groupedContestantsArray);
            } catch (err) {
                setError(err);
            }
        };

        fetchContestants();
    }, [round_number]);

    return { groupedContestants, error };
}

export default useTopThree;
