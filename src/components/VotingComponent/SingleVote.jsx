import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
  let userData;
  let userIdData;

  const handleVoteClick = async () => {
    console.log("handleVoteClick called from singlevote");

    if (!currentUser) {
      setFlashMessage("Log in to vote");
      // Set a timeout to navigate after setting the flash message
      setTimeout(() => {
        navigate("/login", {
          state: { returnPath: location.pathname, actorId },
        });
      }, 4000);
      return;
    }

    try {
      const response = await axios.post(`${URL}/contestants/vote/${actorId}`, {
        votes: 1,
      },
      { headers: { Authorization: `${API_KEY}` } }
      );

      if (response.status === 200) {
        setVoted(true);
        console.log(response.data.message);
        onVoteSuccess();

        if (currentUser) {
          // Retrieve user data
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
        }

        // Use the user's id in the votesData
        const votesData = {
          userId: userIdData,
          contestantId: actorId,
          numberOfVotes: 1,
        };

        const votesResponse = await axios.post(`${URL}/votes`, votesData,
          { headers: { Authorization: `${API_KEY}` } }
          );

        if (votesResponse.status === 201) {
        }

        navigate(`/actors/${actorId}`, {
          state: { returnPath: location.pathname },
        });
      }
    } catch (error) {
      console.error("Error while voting:", error);

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
        <p>
          {voted ? "The contestant thanks you" : "Click the button to vote"}
        </p>
        <button
          className="payment-button"
          onClick={() => handleVoteClick()}
          disabled={voted}
        >
          {" "}
          Vote
        </button>
      </div>
    </div>
  );
}

  