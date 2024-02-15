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
                const currentDate = new Date();
                const activeContestants = response.data.map(contestant => {
                    // Reset votes and set inactive if one week has passed since last update
                    const lastUpdateDate = new Date(contestant.lastUpdated);
                    const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
                    if (lastUpdateDate < oneWeekAgo) {
                        return { ...contestant, votes: 0, active: 0 };
                    }
                    return contestant;
                });
                console.log('Active Contestants:', activeContestants);
                const grouped = [];
                const messages = [];
                for (let i = 0; i < activeContestants.length; i += 4) {
                    const group = activeContestants.slice(i, i + 4);
                    const topThree = group.sort((a, b) => b.votes - a.votes).slice(0, 3);
                    const topThreeNames = topThree.map(contestant => contestant.name);
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
                console.log('Grouped Contestants:', grouped);
                console.log('Top Three Announcements:', messages);
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