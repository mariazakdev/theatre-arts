import React, {useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
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

  const handleVoteSuccess = () => {
    if (actorData) {
      navigate(`/actors/${actorId}`, { state: { actor: actorData } });
    } else {
      console.log('Actor data not available for navigation');

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
          <VotingButtons />
        </div>
      </div>
      <CharityIntro />
    </section>
  );
}
