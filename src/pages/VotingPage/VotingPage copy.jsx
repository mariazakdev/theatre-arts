import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext"; // Import the auth context
import VotingButtons from "../../components/VotingComponent/VotingButtons";
import SingleVote from "../../components/VotingComponent/SingleVote";
import "./VotingPage.scss";
import CharityIntro from "../../components/Charity/CharityIntro";
import UserProfile from "../../components/UserProfile/UserProfile";

export default function VotingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { actorId } = useParams();
  const { currentUser } = useAuth(); // Use the auth context to get the current user
  const [actorData, setActorData] = useState(null);
  const [email, setEmail] = useState(null); // Assuming these states are set
  const [stripeToken, setStripeToken] = useState(null);
  const [amount, setAmount] = useState(null);
  console.log(currentUser);

  useEffect(() => {
    const fetchActor = async () => {
      try {
        const response = await fetch(`http://localhost:8000/upload/${actorId}`);
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
          `http://localhost:8000/upload/vote/${actorId}`,
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
        <div className="vote-top">
          <UserProfile actorId={actorId} />
          <SingleVote
            actorId={actorId}
            onVoteSuccess={handleVoteSuccess}
            navigate={navigate}
            currentUser={currentUser}
          />
        </div>
        <div className="vote-bottom">
          <VotingButtons
            email={email}
            stripeToken={stripeToken}
            actorId={actorId}
            location={location}
            currentUser={currentUser}
          />
        </div>
      </div>

      <CharityIntro />
    </section>
  );
}
