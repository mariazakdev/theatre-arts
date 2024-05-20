import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext"; 
import VotingButtons from "../../components/VotingComponent/VotingButtons";
import SingleVote from "../../components/VotingComponent/SingleVote";
import VoteProfile from "../../components/UserProfile/VoteProfile";
import "./VotingPage.scss";

export default function VotingPage({ URL, CLIENT_URL, API_KEY }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { actorId } = useParams();
  const { currentUser } = useAuth();
  const [actorData, setActorData] = useState(null);
  const [email, setEmail] = useState(null);
  const [stripeToken, setStripeToken] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchActor = async () => {
      try {
        const response = await fetch(`${URL}/contestants/${actorId}`, {
          headers: { Authorization: `${API_KEY}` },
        });
        const data = await response.json();
        setActorData(data);
      } catch (error) {
        console.error("Error in payment or voting process:", error);
      }
    };

    if (actorId) {
      fetchActor();
    }
  }, [actorId]);

  const handleVoteSuccess = async (votes) => {
    if (votes) {
      try {
        const response = await axios.post(
          `${URL}/contestants/vote/${actorId}`,
          { votes },
          { headers: { Authorization: `${API_KEY}` } }
        );

        if (response.status === 200) {
        }
      } catch (error) {
        console.error("Error while voting:", error);
      }
    }
  };

  return (
    <section>
      <div className="vote">
        {errorMessage && (
          <div className="error-message">
            <p>{errorMessage}</p>
          </div>
        )}
        <div className="vote-top">
          <div className="vote-top-left">
            <VoteProfile actorId={actorId} URL={URL} API_KEY={API_KEY} />
          </div>
          <div className="vote-top-right">
            {actorData && actorData.active ? (
              <SingleVote
                URL={URL}
                actorId={actorId}
                onVoteSuccess={handleVoteSuccess}
                navigate={navigate}
                currentUser={currentUser}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                API_KEY={API_KEY}
              />
            ) : (
              <p></p>
            )}
          </div>
        </div>

        <div className="vote-bottom">
          {actorData && actorData.active ? (
            <VotingButtons
              CLIENT_URL={CLIENT_URL}
              URL={URL}
              email={email}
              stripeToken={stripeToken}
              actorId={actorId}
              location={location}
              currentUser={currentUser}
              setErrorMessage={setErrorMessage}
              API_KEY={API_KEY}
            />
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </section>
  );
}