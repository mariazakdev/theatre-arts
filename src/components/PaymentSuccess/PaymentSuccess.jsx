import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import emailjs from "emailjs-com";
import axios from "axios";

const userThankYouId = process.env.REACT_APP_EMAILJS_USER_ID;
const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID_THANK_YOU;
const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID_THANK_YOU;

function PaymentSuccess({ URL, API_KEY, setErrorMessage }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();
  const [processed, setProcessed] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");



  
  const sendThankYouEmail = async (userEmail, actorName, actorEmail) => {
    const emailData = {
      voter_email: userEmail,
      actor_name: actorName,
      // vote_count: numberOfVotes,
      actor_email: actorEmail,
    };
    console.log("Sending thank-you email with data:", {
      userEmail,
      actorName,
      actorEmail,
    });
    try {
      await emailjs.send(serviceId, templateId, emailData, userThankYouId);
    } catch (error) {
      console.error("Error sending thank-you email:", error.text || error);
    }
  };

  useEffect(() => {
    const actorId = searchParams.get("actorId");
    const votes = searchParams.get("votes");

    if (!actorId || !votes || loading) return;
    if (!currentUser) {
      console.error("User not found. Authentication might be delayed.");
      return;
    }
    if (loading) return;

    if (!currentUser) {
      console.error("User not found. Authentication might be delayed.");
      return;
    }
    const updateVotes = async (actorId, votes) => {
      try {


      
        // Send a thank-you email
        const userResponse = await axios.get(`${URL}/users/${currentUser.uid}`, {
          headers: { Authorization: `${API_KEY}` },
        });
    
        if (!userResponse.data || !userResponse.data.user) {
          setFlashMessage("User data not found.");
          return;
        }

        const userData = userResponse.data;
        const userEmail = userData?.user?.email;

        const userIdData = userResponse.data.user.id;

  // ✅ 2. Get the actor (contestant) being voted for
  const actorResponse = await axios.get(`${URL}/contestants/${actorId}`, {
    headers: { Authorization: `${API_KEY}` },
  });

  const actorName = actorResponse.data.name || "Your selected contestant";
  const actorUserId = actorResponse.data.user_id;
  const actorUserResponse = await axios.get(`${URL}/users/${actorUserId}`, {
    headers: { Authorization: `${API_KEY}` },
  });
  const actorEmail = actorUserResponse.data.user.email;
  
        if (!userEmail || !actorName || !votes) {
          console.error("Invalid email data:", { userEmail, actorName, votes });
          return;
        }
  // Cast the votes after payment is confirmed
  const votesData = {
    userId: userIdData,
    contestantId: actorId,
    numberOfVotes: votes,
  };

  const votesResponse = await axios.post(`${URL}/votes-extra`, votesData, {
    headers: { Authorization: `${API_KEY}` },
  });

  // Track the votes
  const votesTrackerData = {
    userId: userIdData,
  contestantId: actorId,
    email: currentUser.email,
    numberOfVotes: votes,
    round: 1,
  };

  await axios.post(`${URL}/votes-tracker`, votesTrackerData, {
    headers: { Authorization: `${API_KEY}` },
  });

        try {
          await sendThankYouEmail(userEmail, actorName, actorEmail);
          setFlashMessage("Thank you for your contribution and for helping this contestant win!");
        } catch {
          setFlashMessage("Your vote was processed, but we could not send a thank-you email.");
        }

        setProcessed(true);
        setTimeout(() => {
          navigate(`/actors/vote/${actorId}`);
        }, 5000);
      } catch (voteError) {
        console.error("Error while updating votes:", voteError);
        setFlashMessage("There was an issue processing your vote. Please try again later.");
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