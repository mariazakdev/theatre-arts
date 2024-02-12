import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useTopThree from '../../hooks/useTopThree'; 

function ContestantsTopThree() {
const groupedContestants = useTopThree();

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
                                {group.indexOf(contestant) === 0 && <h4>This contestant is currently in first place, help them stay here.</h4>}
                                {group.indexOf(contestant) === 1 && <h4>This contestant is currently in second place, help them win.</h4>}
                                {group.indexOf(contestant) === 2 && <h4>This contestant is currently in third place, help them win.</h4>}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default ContestantsTopThree;
