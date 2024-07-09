import { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_API_KEY;
const URL = process.env.REACT_APP_BACKEND_URL;

function useTopThree(round_number) {
    const [topThree, setTopThree] = useState([]);
    const [error, setError] = useState(null);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchTopThree = async () => {
            try {
                const response = await axios.get(`${URL}/contestants`, {
                    params: { round: round_number },
                   headers: { Authorization: `${API_KEY}` },
});
                const contestants = response.data;
                console.log("CONTESTANTS", contestants);

                // Sort contestants by votes and map announcements
                const sortedContestants = contestants.sort((a, b) => b.votes - a.votes);
                const updatedContestants = sortedContestants.map((contestant, index) => {
                    let announce = '';
                    if (contestants.length <= 10) {
                        switch (index) {
                            case 0:
                                announce = `${contestant.name} has won. Congratulations!`;
                                break;
                            case 1:
                                announce = `${contestant.name}, is second in the final result.`;
                                break;
                            case 2:
                                announce = `${contestant.name}, is third in the final result.`;
                                break;
                            default:
                                announce = '';
                        }
                    } else {
                        switch (index) {
                            case 0:
                                announce = `${contestant.name}, is in first! Help them stay there!`;
                                break;
                            case 1:
                                announce = `${contestant.name}, is currently second! Help them get to first!`;
                                break;
                            case 2:
                                announce = `${contestant.name}, is currently third! Help them get to first!`;
                                break;
                            default:
                                announce = '';
                        }
                    }
                    return { ...contestant, announce };
                });

                setTopThree(updatedContestants);

                // Group contestants by group_number
                const groupedContestants = groupContestantsByGroupNumber(updatedContestants);
                setGroups(groupedContestants);
            } catch (err) {
                setError(err);
            }
        };

        fetchTopThree();
    }, [round_number]);

    const groupContestantsByGroupNumber = (contestants) => {
        const groupMap = {};
        contestants.forEach(contestant => {
            const group = contestant.group_number || 'No Group';
            if (!groupMap[group]) {
                groupMap[group] = [];
            }
            groupMap[group].push(contestant);
        });
        return groupMap;
    };

    console.log("GROUPS", groups);
    console.log("TOP THREE", topThree);
    console.log("ERROR", error);

    return { topThree, error, groups };
}

export default useTopThree;
