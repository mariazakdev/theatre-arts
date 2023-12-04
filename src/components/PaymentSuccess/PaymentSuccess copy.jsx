// PaymentSuccess.js

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    const actorId = searchParams.get('actorId');
    const votes = searchParams.get('votes');

    const updateVotes = async (actorId, votes) => {
      try {
        const response = await axios.post(
          `http://localhost:8000/upload/vote/${actorId}`,
          { votes: votes }
        );

        if (response.status === 200) {
          console.log('Votes recorded:', response.data);
          navigate(`/actors/${actorId}`);
          setProcessed(true);
        }
      } catch (error) {
        console.error('Error while voting:', error);
      }
    };

    if (actorId && votes && !processed) {
      updateVotes(actorId, votes);
    }
  }, [searchParams, navigate, processed]);

  return <div>{processed ? 'Vote processed successfully!' : 'Processing your vote...'}</div>;
}

export default PaymentSuccess;
