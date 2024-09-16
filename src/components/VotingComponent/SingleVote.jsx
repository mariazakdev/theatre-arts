import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import "./VotingButtons.scss";

export default function SingleVote({
  URL,
  actorId,
  onVoteSuccess,
  currentUser,
  setErrorMessage,
  API_KEY
}) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [voted, setVoted] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");

  const handleVoteClick = async () => {

    if (!currentUser) {
      setFlashMessage("Log in to vote");
      setTimeout(() => {
        navigate("/login", {
          state: { returnPath: location.pathname, actorId },
        });
      }, 4000);
      return;
    }

    try {
      let userIdData;
      let userEmail;

      // Check if the user exists in the backend
      const userResponse = await axios.get(`${URL}/users/${currentUser.uid}`, {
        headers: { Authorization: `${API_KEY}` },
      });

      // If the user doesn't exist (404 error), redirect to sign-up
      if (!userResponse.data.user) {
        setFlashMessage("Sign up to vote");
        setTimeout(() => {
          navigate("/signup", {
            state: { returnPath: location.pathname, actorId },
          });
        }, 4000);
        return;
      }

      userIdData = userResponse.data.user.id;
      userEmail = userResponse.data.user.email;

      // Proceed with voting
      const votesData = {
        userId: userIdData,
        contestantId: actorId,
        numberOfVotes: 1,
      };

      const votesTrackerData = {
        userId: userIdData,
        email: userEmail,
        contestantId: actorId,
        numberOfVotes: 1,
        round: 1,
      };

      await axios.post(`${URL}/votes`, votesData, {
        headers: { Authorization: `${API_KEY}` },
      });

      await axios.post(`${URL}/votes-tracker`, votesTrackerData, {
        headers: { Authorization: `${API_KEY}` },
      });

 // Show success message
 setVoted(true); // Disable the button after voting
 setFlashMessage("Vote successfully cast. Thank you for voting!");
 setTimeout(() => {
  navigate(`/vote-payment-singlevote?actorId=${actorId}&votes=${1}`, {
    state: { returnPath: location.pathname, actorId },
  });
}, 4000);

  
    } catch (error) {
      console.error("Error while voting:", error);

      if (error.response && error.response.status === 404) {
        setFlashMessage("Please complete the sign up process");
        setTimeout(() => {
          navigate("/login", {
            state: { returnPath: location.pathname, actorId },
          });
        }, 4000);
      }

      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      }
    }
  };

  return (
    <div className="button-wrap__free">
      <div className="button-wrap__free-button">
        {flashMessage && <p className="flash-message">{flashMessage}</p>}

        <h2>Your Vote</h2>
        <p>{voted ? "The contestant thanks you" : "Click the button to vote"}</p>
        <button
          className="payment-button"
          onClick={() => handleVoteClick()}
          disabled={voted}
        >
          Vote
        </button>
      </div>
    </div>
  );
}
