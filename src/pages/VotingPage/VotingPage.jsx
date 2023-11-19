import React, {useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import VotingButtons from "../../components/VotingComponent/VotingButtons";
import SingleVote from "../../components/VotingComponent/SingleVote";
import "./VotingPage.scss";
import CharityIntro from "../../components/Charity/CharityIntro";
import UserProfile from "../../components/UserProfile/UserProfile";

export default function VotingPage() {

  const navigate = useNavigate();
  const { actorId } = useParams();
  const [actorData, setActorData] = useState(null);

  useEffect(() => {
    const fetchActor = async () => {
      try {
        const response = await fetch(`http://localhost:8000/upload/${actorId}`);
        const data = await response.json();
        setActorData(data);
      } catch (error) {
        console.error('Error fetching actor data:', error);
      }
    };

    if (actorId) {
      fetchActor();
    }
  }, [actorId]);

  console.log('Actor ID:', actorId);

  const handleVoteSuccess = async (votes) => {
    if (votes) {
      try {
        const response = await axios.post(`http://localhost:8000/upload/vote/${actorId}`, { votes });
        if (response.status === 200) {
          console.log('Votes recorded:', response.data);
          // Handle any post-vote logic here
        }
      } catch (error) {
        console.error('Error while voting:', error);
      }
    }
  };

  return (
    <section>
      <div className="vote">
        <div className="vote-top">
          <UserProfile actorId={actorId} />
          <SingleVote actorId={actorId} onVoteSuccess={handleVoteSuccess} />
        </div>
        <div className="vote-bottom">
          <VotingButtons onVoteSuccess={handleVoteSuccess}  successUrl={`http://localhost:3000/actors/${actorId}`} />
        </div>
      </div>
      <CharityIntro />
    </section>
  );
}
