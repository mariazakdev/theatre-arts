import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import axios from "axios";
import "./VotingButtons.scss";

export default function SingleVote({ actorId, onVoteSuccess,currentUser }) {
  const { user } = useAuth();
  const location = useLocation();
  console.log("Return Path:", location.state?.returnPath);

  const navigate = useNavigate(); 

  const [voted, setVoted] = useState(false);

  const handleVoteClick = async () => {
    console.log("handleVoteClick called from singlevote");

    if (!currentUser) {
      navigate("/login", { state: { returnPath: location.pathname } });
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8000/upload/vote/${actorId}`,
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
