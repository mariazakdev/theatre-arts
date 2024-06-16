import { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_API_KEY;
const URL = process.env.REACT_APP_BACKEND_URL;
function useTopThree() {
    const [groupedContestants, setGroupedContestants] = useState([]);
    const [topThreeMessages, setTopThreeMessages] = useState([]);
    const [totalContestants, setTotalContestants] = useState(0);


    useEffect(() => {
        const fetchContestants = async () => {
            try {
                const response = await axios.get(`${URL}/contestants`, 
                {
                    headers: { Authorization: `${API_KEY}` },
                
                }
            );

                const activeContestants = response.data.filter(contestant => contestant.active === 1);
                setTotalContestants(activeContestants.length);
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

    return { groupedContestants, topThreeMessages, totalContestants };
}

export default useTopThree;
