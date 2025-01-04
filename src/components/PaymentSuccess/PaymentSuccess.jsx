import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import emailjs from "emailjs-com";
import axios from 'axios';

const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID_THANK_YOU;
const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID_THANK_YOU;
const userId = process.env.REACT_APP_EMAILJS_USER_ID;


function PaymentSuccess({ URL, API_KEY, setErrorMessage }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [processed, setProcessed] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");

  const sendThankYouEmail = async (voterEmail, actorName, numberOfVotes, actorEmail) => {
    const emailData = {
      email: voterEmail, // Match placeholder name in template
      contestant_name: actorName,
      vote_count: numberOfVotes,
      actorEmail,
    };

    try {
      await emailjs.send(
       serviceId,
        templateId,
        emailData,
        userId
      );
//     
    } catch (error) {
      console.error("Error sending thank-you email:", error.text || error);
    }
  };

  useEffect(() => {
    const actorId = searchParams.get('actorId');
    const votes = searchParams.get('votes');

    const updateVotes = async (actorId, votes) => {
      try {
        const response = await axios.post(
          `${URL}/contestants/vote/${actorId}`,
          { votes: votes },
          { headers: { Authorization: `${API_KEY}` } }
        );

        if (response.status === 200) {
          const userResponse = await axios.get(
            `${URL}/users/${currentUser.uid}`,
            { headers: { Authorization: `${API_KEY}` } }
          );

          const userData = userResponse.data;
          const userIdData = userData?.user?.id;
          const voterEmail = userData?.user?.email;
          const actorName = userData.contestant?.name || "Your selected contestant";
          const actorEmail = userData.contestant?.email; 
console.log(userData, userIdData,voterEmail, actorName );

          if (!voterEmail || !actorName || !votes) {
            console.error("Invalid email data:", { voterEmail, actorName, votes });
            return;
          }

          try {
            await sendThankYouEmail(voterEmail, actorName, votes);
            setFlashMessage('Thank you for your contribution and for helping this contestant win!');
          } catch {
            setFlashMessage('Your vote was processed, but we could not send a thank-you email.');
          }

          setProcessed(true);
          setTimeout(() => {
            navigate(`/actors/vote/${actorId}`);
          }, 5000);
        }
      } catch (voteError) {
        console.error("Error while updating votes:", voteError);
        setFlashMessage('There was an issue processing your vote. Please try again later.');
      }
    };

    if (!processed && actorId && votes) {
      updateVotes(actorId, votes);
    }
  }, [searchParams, navigate, processed, currentUser, URL, API_KEY]);

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
