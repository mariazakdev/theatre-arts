import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

function PaymentSuccess({ URL, API_KEY, setErrorMessage }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();
  const [processed, setProcessed] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");

  useEffect(() => {
    const actorId = searchParams.get("actorId");
    const votes = searchParams.get("votes");

    if (!actorId || !votes) {
      setFlashMessage("Invalid payment response. No votes recorded.");
      return;
    }

    if (loading) return;
    if (!currentUser) {
      setFlashMessage("You must be logged in to record your votes.");
      return;
    }

    const updateVotes = async () => {
      try {

        const actorResponse = await axios.get(`${URL}/contestants/thankyou-info/${actorId}`, {
          headers: { Authorization: `${API_KEY}` },
        });
        // see backend. it labeled these as such. 
        const actorData = actorResponse.data;
        const actorEmail = actorData.actorEmail;
        const actorName = actorData.actorName || "Your selected contestant";

        const userResponse = await axios.get(`${URL}/users/${currentUser.uid}`, {
          headers: { Authorization: `${API_KEY}` },
        });

           const userIdData = userResponse.data.user.id;
        
        if (!userResponse.data || !userResponse.data.user) {
          setFlashMessage("User data not found.");
          return;
        }

        const votesData = {
          userId: userIdData,
          contestantId: actorId,
          numberOfVotes: votes,
        };

        await axios.post(`${URL}/votes-extra`, votesData, {
          headers: { Authorization: `${API_KEY}` },
        });

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

        setFlashMessage("Your votes were recorded successfully!");
        setProcessed(true);

        navigate("/thank-you", {
          state: {
            actorId,
            userData: {
              actorName,
              actorEmail,
            },
          },
        });
      } catch (error) {
        console.error("Vote update failed:", error);
        setFlashMessage("There was an issue processing your vote. Please try again later.");
      }
    };

    if (!processed && actorId && votes) {
      updateVotes();
    }
  }, [searchParams, navigate, processed, currentUser, loading, URL, API_KEY]);

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