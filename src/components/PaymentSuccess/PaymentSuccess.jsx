import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PaymentSuccess({ URL, API_KEY}) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [processed, setProcessed] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    const actorId = searchParams.get('actorId');
    const votes = searchParams.get('votes');

    const updateVotes = async (actorId, votes) => {
      try {
        const response = await axios.post(
          `${URL}/contestants/vote/${actorId}`,
          { votes: votes },
          {
            headers: {
              Authorization: `${API_KEY}`,
            },
          }
        );

        if (response.status === 200) {
          console.log('Votes recorded:', response.data);
          navigate(`/actors/${actorId}`,);
          setProcessed(true);
        }
      } catch (error) {
        console.error('Error while voting:', error);
      }
    };

    if (isMounted.current && actorId && votes && !processed) {
      updateVotes(actorId, votes);
      isMounted.current = false;
    }
  }, [searchParams, navigate, processed]);

  return <div>{processed ? 'Vote processed successfully!' : 'Processing your vote...'}</div>;
}

export default PaymentSuccess;
