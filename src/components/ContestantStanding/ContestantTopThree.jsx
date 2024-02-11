import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ContestantsTopThree() {
    const [contestants, setContestants] = useState([]);
    const [groupedContestants, setGroupedContestants] = useState([]);

    useEffect(() => {
        const fetchContestants = async () => {
            try {
                const response = await axios.get('http://localhost:8000/contestants');
                const activeContestants = response.data.filter(contestant => contestant.active === 1);
                const grouped = [];
                for (let i = 0; i < activeContestants.length; i += 4) {
                    const group = activeContestants.slice(i, i + 4);
                    const topThree = group.sort((a, b) => b.votes - a.votes).slice(0, 3);
                    grouped.push(topThree);
                }
                setGroupedContestants(grouped);
            } catch (error) {
                console.error('Error fetching contestants:', error);
            }
        };

        fetchContestants();
    }, []);

    return (
        <div>
            <h1>Contestants</h1>
            {groupedContestants.map((group, index) => (
                <div key={index}>
                    <h2>Group {index + 1}</h2>
                    <ul>
                        {group.map(contestant => (
                            <li key={contestant.id}>
                                <p>{contestant.name}</p>
                                <p>{contestant.active}</p>
                                <p>Votes: {contestant.votes}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default ContestantsTopThree;
