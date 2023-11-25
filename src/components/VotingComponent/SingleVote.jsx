import React, { useState } from 'react';
import { useParams } from "react-router-dom";

import axios from 'axios';
import './VotingButtons.scss';

export default function SingleVote({ actorId, onVoteSuccess,navigate   }) {
    const [voted, setVoted] = useState(false);

    const handleVoteClick = async () => {
        try {
            const response = await axios.post(
                `http://localhost:8000/upload/vote/${actorId}`,
            { votes: 1  }
            );
    
            if (response.status === 200) {
                setVoted(true); 
                console.log(response.data.message);
                onVoteSuccess();           
                navigate(`/actors/${actorId}`); 
            }
        } catch (error) {
            console.error('Error while voting:', error);
        }
    };
    return (
        <div className='button-wrap'>
            <h2>Your Vote</h2>
            <p>{voted ? 'You have voted!' : 'Click the button to vote'}</p>
            <button className="payment-button" onClick={() => handleVoteClick()} disabled={voted}> Vote</button>
        </div>
    );
}
