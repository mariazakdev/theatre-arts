import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminActorsList.scss';

function AdminVotingStandings() {
    const [contestants, setContestants] = useState([]);
    const [groupedContestants, setGroupedContestants] = useState([]);

    useEffect(() => {
        const fetchContestants = async () => {
            try {
                const response = await axios.get('http://localhost:8000/contestants', 
                {
                    headers: {
                      Authorization: `${API_KEY}`,
                    },
                  } 
                
                );
                const activeContestants = response.data.filter(contestant => contestant.active === 1);
                const grouped = [];
                for (let i = 0; i < activeContestants.length; i += 4) {
                    const group = activeContestants.slice(i, i + 4);
                    const topThree = group.sort((a, b) => b.votes - a.votes).slice(0, 4);
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
<div className="admin-actor">
                <h1>Contestants</h1>
            {groupedContestants.map((group, index) => (
                <div 
                className="admin-actor__card" 
                key={index}>
                    <h2>Group {index + 1}</h2>
                    <ul>
                        {group.map(contestant => (
                            <div className='admin-actor__card-content' >
                            <li key={contestant.id}>
                                <p>{contestant.name}</p>
                                <p>{contestant.active}</p>
                                <p>Votes: {contestant.votes}</p>
                                {group.indexOf(contestant) === 0 && <h4>This contestant is currently in first place, help them stay here.</h4>}
                                {group.indexOf(contestant) === 1 && <h4>This contestant is currently in second place, help them win.</h4>}
                                {group.indexOf(contestant) === 2 && <h4>This contestant is currently in third place, help them win.</h4>}
                            </li>
                            </div>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default AdminVotingStandings;
