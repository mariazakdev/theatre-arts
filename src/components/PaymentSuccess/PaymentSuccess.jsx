import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const actorId = searchParams.get('actorId');
        const votes = searchParams.get('votes');

        const updateVotes = async (actorId, votes) => {
            try {
                const response = await axios.post(
                    `http://localhost:8000/upload/vote/${actorId}`,
                    { votes: parseInt(votes, 10) }
                );

                if (response.status === 200) {
                    console.log("Votes recorded:", response.data);
                    navigate(`/actors/${actorId}`); // Redirect after updating votes
                }
            } catch (error) {
                console.error("Error while voting:", error);
            }
        };

        if (actorId && votes) {
            updateVotes(actorId, votes);
        }
    }, [searchParams, navigate]);

    return <div>Processing your vote...</div>;
}

export default PaymentSuccess;
