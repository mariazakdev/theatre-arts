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
  let votesTracker;

  const handleVoteClick = async () => {

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
      let userIdData;
      let userEmail;

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
            userEmail = userData.user.email;
          }
        }

        // Use the user's id in the votesData
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
          round:1
        };
        const votesResponse = await axios.post(`${URL}/votes`, votesData,
          { headers: { Authorization: `${API_KEY}` } }
          );

        if (votesResponse.status === 201) {
        }
       
  const votesTrackerResponse = await axios.post(`${URL}/votes-tracker`, 
    votesTrackerData
    ,  
    { headers: { Authorization: `${API_KEY}` } }
    );
    if (votesTrackerResponse.status === 201) {
    }
    console.log("votes tracker added", votesTrackerResponse);

        navigate( `/vote-payment-singlevote?actorId=${actorId}&votes=${1}`, {
          state: { returnPath: location.pathname },
        });
      
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

// //  Button fully disabled until further notice
//           disabled={true}
//           className="disabled-button payment-button"

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

  