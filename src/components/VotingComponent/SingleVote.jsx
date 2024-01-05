import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import "./VotingButtons.scss";

export default function SingleVote({ actorId, onVoteSuccess,currentUser }) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate(); 

  const [voted, setVoted] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");

  const handleVoteClick = async () => {
    console.log("handleVoteClick called from singlevote");

    if (!currentUser) {
      setFlashMessage("Log in to vote");
      // Set a timeout to navigate after setting the flash message
      setTimeout(() => {
        navigate("/login", { state: { returnPath: location.pathname, actorId } });
      }, 4000);
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8000/contestants/vote/${actorId}`,
        { votes: 1 }
      );

      if (response.status === 200) {
        setVoted(true);
        console.log(response.data.message);
        onVoteSuccess();
        navigate(`/actors/${actorId}`, { state: { returnPath: location.pathname } });
      }
    } catch (error) {
      console.error("Error while voting:", error);
    }
  };


  return (
    <div className="button-wrap">
                 {flashMessage && <p className="flash-message">{flashMessage}</p>}

      <h2>Your Vote</h2>
      <p>{voted ? "You have voted!" : "Click the button to vote"}</p>
      <button
        className="payment-button"
        onClick={() => handleVoteClick()}
        disabled={voted}
      >
        {" "}
        Vote
      </button>
    </div>
  );
}
