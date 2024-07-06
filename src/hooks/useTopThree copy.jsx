
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_API_KEY;
const URL = process.env.REACT_APP_BACKEND_URL;

function useTopThree() {
    const [groupedContestants, setGroupedContestants] = useState([]);
    const [topThreeMessages, setTopThreeMessages] = useState([]);
    const [totalContestants, setTotalContestants] = useState(0);
    const [remainderContestants, setRemainderContestants] = useState([]);

    useEffect(() => {
        const fetchContestants = async () => {
            try {
                const response = await axios.get(`${URL}/contestants`, {
                    headers: { Authorization: `${API_KEY}` },
                });

                const activeContestants = response.data.filter(contestant => contestant.active === 1);
                setTotalContestants(activeContestants.length);

                const rounds = Array.from(new Set(activeContestants.map(contestant => contestant.round)));
                const grouped = [];
                const messages = [];
                const remainder = [];

                rounds.forEach(round => {
                    const contestantsInRound = activeContestants.filter(contestant => contestant.round === round);

                    contestantsInRound.forEach((contestant, index) => {
                        contestant.group_number = Math.floor(index / 10) + 1;
                    });

                    if (contestantsInRound.length <= 10) {
                        for (let i = 0; i < contestantsInRound.length; i += 10) {
                            const group = contestantsInRound.slice(i, i + 10);
                            const topThree = group.sort((a, b) => b.votes - a.votes).slice(0, 3);
                            const remainderGroup = group.slice(3);
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
                            grouped.push({ topThree: topThreeWithAnnouncements, remainder: remainderGroup });
                            messages.push(topThreeWithAnnouncements.map(contestant => contestant.announce));
                            remainder.push(...remainderGroup);
                        }
                    } else {
                        for (let i = 0; i < contestantsInRound.length; i += 10) {
                            const group = contestantsInRound.slice(i, i + 10);
                            const topThree = group.sort((a, b) => b.votes - a.votes).slice(0, 3);
                            const remainderGroup = group.slice(3);
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
                            grouped.push({ topThree: topThreeWithAnnouncements, remainder: remainderGroup });
                            messages.push(topThreeWithAnnouncements.map(contestant => contestant.announce));
                            remainder.push(...remainderGroup);
                        }
                    }
                });

                console.log('Grouped Contestants:', grouped);
                console.log('Announcements:', messages);
                console.log('Remainder Contestants:', remainder);

                setGroupedContestants(grouped);
                setTopThreeMessages(messages);
                setRemainderContestants(remainder);
            } catch (error) {
                console.error('Error fetching contestants:', error);
            }
        };

        fetchContestants();
    }, []);

    return { groupedContestants, topThreeMessages, totalContestants, remainderContestants };
}

export default useTopThree;
