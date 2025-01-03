import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DashboardSeeGroups.scss';

function DashboardSeeGroups({ URL, API_KEY, contestantId }) {
    const [group, setGroup] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                // Fetch the current contestant's details first to get their group number
                const contestantResponse = await axios.get(`${URL}/contestants/${contestantId}`, {
                    headers: { Authorization: API_KEY },
                });
                const contestant = contestantResponse.data;

                if (!contestant || !contestant.group_number) {
                    throw new Error("Contestant or their group number not found");
                }

                // Fetch all contestants and filter by the current contestant's group number
                const response = await axios.get(`${URL}/contestants`, {
                    headers: { Authorization: API_KEY },
                });
                const allContestants = response.data;

                const groupData = allContestants.filter(c => c.group_number === contestant.group_number);
                setGroup(groupData);
            } catch (err) {
                setError(err);
            }
        };

        fetchGroup();
    }, [URL, API_KEY, contestantId]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="dashboard-see-groups">
            <h1>Your Group</h1>
            <div>
                {group.length > 0 ? (
                    <ul>
                        {group.map(contestant => (
                            <li key={contestant.id}>
                                <p>Name: {contestant.name}</p>
                                <p>Votes: {contestant.votes}</p>
                                {/* <p>Group: {contestant.group_number}</p> */}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No group members found.</p>
                )}
            </div>
        </div>
    );
}

export default DashboardSeeGroups;
