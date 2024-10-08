import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext"; 

import axios from 'axios';

function PaymentSuccess({ URL, API_KEY, setErrorMessage}) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [processed, setProcessed] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");
  const isMounted = useRef(true);

  useEffect(() => {
    const actorId = searchParams.get('actorId');
    const votes = searchParams.get('votes');
    let userData;
    let userIdData;

    const updateVotes = async (actorId, votes) => {
      try {
        // Perform backend update here
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
          // Update votes-extra
          const userResponse = await axios.get(
            `${URL}/users/${currentUser.uid}`,
            {
              headers: { Authorization: `${API_KEY}` },
            }
          );
          userData = userResponse.data;
          if (userData.user) {
            userIdData = userData.user.id;
          }

          // Use the user's id in the votesData
          const votesData = {
            userId: userIdData,
            contestantId: actorId,
            numberOfVotes: 1,
          };
    // Set a success message
    setFlashMessage('Thank you for your contribution and for helping this contestant win!');
    setProcessed(true);
    
    // Delay the redirect for 3 seconds to show the success message
    setTimeout(() => {
      navigate(`/actors/vote/${actorId}`);
    }, 5000);
  }        
      } catch (error) {
        console.error('Error while updating votes:', error);
      
      }
    };
    if (isMounted.current && actorId && votes && !processed) {
      updateVotes(actorId, votes);
      isMounted.current = false;
    }
  }, [searchParams, navigate, processed]);

  return (
    <div className="payment-success">
      {processed ? (
        <p className="flash-message">{flashMessage}</p>
      ) : (
        <p className="processing-message">Processing your vote...</p>
      )}
    </div>
  );


}

export default PaymentSuccess;