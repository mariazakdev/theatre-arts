import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext"; // Import the auth context
import VotingButtons from "../../components/VotingComponent/VotingButtons";
import SingleVote from "../../components/VotingComponent/SingleVote";
import UserProfile from "../../components/UserProfile/UserProfile";
import "./VotingPage.scss";

export default function VotingPage({URL, CLIENT_URL}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { actorId } = useParams();
  const { currentUser } = useAuth(); 
  const [actorData, setActorData] = useState(null);
  const [email, setEmail] = useState(null); 
  const [stripeToken, setStripeToken] = useState(null);
  const [amount, setAmount] = useState(null);
  const [voterTimer, setVoterTimer] = useState(null);
  console.log( "current user voting pg", currentUser);
  const [errorMessage, setErrorMessage] = useState(null);


  useEffect(() => {
    const fetchActor = async () => {
      try {
        const response = await fetch(`${URL}/contestants/${actorId}`);
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


  console.log("Actor ID:", actorId);

  const handleVoteSuccess = async (votes) => {
    if (votes) {

      try {
        const response = await axios.post(
          `${URL}/contestants/vote/${actorId}`,
          { votes }
        );


          if (response.status === 200) {
          console.log("Votes recorded:", response.data);
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
            <UserProfile actorId={actorId} URL={URL}  />
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
            />
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </section>
  );
}
   