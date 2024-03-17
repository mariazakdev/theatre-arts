// import { useState, useEffect } from 'react';
// import axios from 'axios';

// function useTopThree() {
//     const [groupedContestants, setGroupedContestants] = useState([]);
//     const [topThreeMessages, setTopThreeMessages] = useState([]);

//     useEffect(() => {
//         const fetchContestants = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8000/contestants');
//                 console.log('Response:', response.data);

//                 const activeContestants = response.data;

//                 const grouped = [];
//                 const messages = [];

//                 for (let i = 0; i < activeContestants.length; i += 10) {
//                     const group = activeContestants.slice(i, i + 10);
//                     const topThree = group.sort((a, b) => b.votes - a.votes).slice(0, 3);
//                     const topThreeNames = topThree.map(contestant => contestant.name);
//                     const topThreeWithAnnouncements = topThree.map((contestant, index) => {
//                         switch (index) {
//                             case 0:
//                                 return { ...contestant, announce: `${contestant.name}, is in first! Help them stay there!` };
//                             case 1:
//                                 return { ...contestant, announce: `${contestant.name}, is currently second! Help them get to first!` };
//                             case 2:
//                                 return { ...contestant, announce: `${contestant.name}, is currently third! Help them get to first!` };
//                             default:
//                                 return { ...contestant, announce: '' };
//                         }
//                     });
//                     grouped.push(topThreeWithAnnouncements);
//                     messages.push(topThreeWithAnnouncements.map(contestant => contestant.announce));
//                 }

//                 console.log('Grouped Contestants:', grouped);
//                 console.log('Top Three Announcements:', messages);

//                 setGroupedContestants(grouped);
//                 setTopThreeMessages(messages);
//             } catch (error) {
//                 console.error('Error fetching contestants:', error);
//             }
//         };

//         fetchContestants();
//     }, []);

//     return { groupedContestants, topThreeMessages };
// }

// export default useTopThree;

//winner
// import { useState, useEffect } from 'react';
// import axios from 'axios';

// function useTopThree() {
//     const [groupedContestants, setGroupedContestants] = useState([]);
//     const [topThreeMessages, setTopThreeMessages] = useState([]);

//     useEffect(() => {
//         const fetchContestants = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8000/contestants');
//                 console.log('Response:', response.data);

//                 const activeContestants = response.data;

//                 const grouped = [];
//                 const messages = [];

//                 if (activeContestants.length <= 10) {
//                     // Handle placement announcements
//                     const winner = activeContestants[0];
//                     const second = activeContestants[1];
//                     const third = activeContestants[2];

//                     const winnerMessage = { ...winner, announce: `${winner.name} is the winner!` };
//                     const secondMessage = { ...second, announce: `${second.name} is in second place.` };
//                     const thirdMessage = { ...third, announce: `${third.name} is in third place.` };

//                     grouped.push([winnerMessage, secondMessage, thirdMessage]);
//                     messages.push([winnerMessage.announce, secondMessage.announce, thirdMessage.announce]);
//                 } else {
//                     // Handle top three announcements
//                     for (let i = 0; i < activeContestants.length; i += 10) {
//                         const group = activeContestants.slice(i, i + 10);
//                         const topThree = group.sort((a, b) => b.votes - a.votes).slice(0, 3);
//                         const topThreeNames = topThree.map(contestant => contestant.name);
//                         const topThreeWithAnnouncements = topThree.map((contestant, index) => {
//                             switch (index) {
//                                 case 0:
//                                     return { ...contestant, announce: `${contestant.name}, is in first! Help them stay there!` };
//                                 case 1:
//                                     return { ...contestant, announce: `${contestant.name}, is currently second! Help them get to first!` };
//                                 case 2:
//                                     return { ...contestant, announce: `${contestant.name}, is currently third! Help them get to first!` };
//                                 default:
//                                     return { ...contestant, announce: '' };
//                             }
//                         });
//                         grouped.push(topThreeWithAnnouncements);
//                         messages.push(topThreeWithAnnouncements.map(contestant => contestant.announce));
//                     }
//                 }

//                 console.log('Grouped Contestants:', grouped);
//                 console.log('Announcements:', messages);

//                 setGroupedContestants(grouped);
//                 setTopThreeMessages(messages);
//             } catch (error) {
//                 console.error('Error fetching contestants:', error);
//             }
//         };

//         fetchContestants();
//     }, []);

//     return { groupedContestants, topThreeMessages };
// }

// export default useTopThree;

import { useState, useEffect } from 'react';
import axios from 'axios';

function useTopThree() {
    const [groupedContestants, setGroupedContestants] = useState([]);
    const [topThreeMessages, setTopThreeMessages] = useState([]);

    useEffect(() => {
        const fetchContestants = async () => {
            try {
                const response = await axios.get('http://localhost:8000/contestants');
                console.log('Response:', response.data);

                const activeContestants = response.data.filter(contestant => contestant.active === 1);

                const grouped = [];
                const messages = [];

                if (activeContestants.length <= 10) {
                    for (let i = 0; i < activeContestants.length; i += 10) {
                        const group = activeContestants.slice(i, i + 10);
                        const topThree = group.sort((a, b) => b.votes - a.votes).slice(0, 3);
                        const topThreeWithAnnouncements = topThree.map((contestant, index) => {
                            switch (index) {
                                case 0:
                                    return { ...contestant, announce: `${contestant.name} has won. Congratulations!` };
                                case 1:
                                    return { ...contestant, announce: `${contestant.name}, is second in final result.` };
                                case 2:
                                    return { ...contestant, announce: `${contestant.name}, is third in final result.` };
                                default:
                                    return { ...contestant, announce: '' };
                            }
                        });
                        grouped.push(topThreeWithAnnouncements);
                        messages.push(topThreeWithAnnouncements.map(contestant => contestant.announce));
                    }
                } else {
                    // Handle top three announcements
                    for (let i = 0; i < activeContestants.length; i += 10) {
                        const group = activeContestants.slice(i, i + 10);
                        const topThree = group.sort((a, b) => b.votes - a.votes).slice(0, 3);
                        const topThreeWithAnnouncements = topThree.map((contestant, index) => {
                            switch (index) {
                                case 0:
                                    return { ...contestant, announce: `${contestant.name}, is in first! Help them stay there!` };
                                case 1:
                                    return { ...contestant, announce: `${contestant.name}, is currently second! Help them get to first!` };
                                case 2:
                                    return { ...contestant, announce: `${contestant.name}, is currently third! Help them get to first!` };
                                default:
                                    return { ...contestant, announce: '' };
                            }
                        });
                        grouped.push(topThreeWithAnnouncements);
                        messages.push(topThreeWithAnnouncements.map(contestant => contestant.announce));
                    }
                }

                console.log('Grouped Contestants:', grouped);
                console.log('Announcements:', messages);

                setGroupedContestants(grouped);
                setTopThreeMessages(messages);
            } catch (error) {
                console.error('Error fetching contestants:', error);
            }
        };

        fetchContestants();
    }, []);

    return { groupedContestants, topThreeMessages };
}

export default useTopThree;
