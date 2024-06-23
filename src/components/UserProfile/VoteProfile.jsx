import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import useTopThree from "../../hooks/useTopThree";
import VideoPlayer from "../VideoEmbed/VideoEmbed";
import "./VoteProfile.scss";


function VoteProfile({ URL, API_KEY }) {
  const { actorId } = useParams();
  const [localActorData, setLocalActorData] = useState(null);
  const [announce, setAnnounce] = useState(null);
  const playerRef = useRef(null);
  const { groupedContestants, topThreeMessages } = useTopThree();

  // Fetch contestant data
  useEffect(() => {
    if (!actorId) {
      console.error("No actor ID provided");
      return;
    }

    const fetchActorData = async () => {
      try {
        const response = await axios.get(`${URL}/contestants/${actorId}`, {
          headers: { Authorization: `${API_KEY}` },
        });
        setLocalActorData(response.data);
      } catch (error) {
        console.error("Error fetching actor data:", error);
      }
    };

    fetchActorData();
  }, [actorId]);

  // Check if the contestant is in the top three of their group
  useEffect(() => {
    if (groupedContestants && groupedContestants.length > 0 && actorId) {
      groupedContestants.forEach((group) => {
        group.forEach((contestant) => {
          if (contestant.id === parseInt(actorId)) {
            setAnnounce(contestant.announce);
          }
        });
      });
    }
  }, [groupedContestants, actorId]);

  if (!localActorData) {
    return <div>Loading...</div>;
  }

  const actor = localActorData;
  const videoSrc = actor.url_video
    ? actor.url_video.replace("watch?v=", "embed/")
    : "";

  

  return (
    <section className="vote-profile">
            {/* Announcement of rank */}
      {topThreeMessages && (
        <div className="vote-profile__top-three-messages">
          {topThreeMessages.map((message) => (
            <div key={message.id}>{message.text}</div>
          ))}
        </div>
      )}
      {/* Announcement of rank */}
      {announce && (
        <Link to={`/actors/vote/${actorId}`} className="link-style">
          <div className="vote-profile__top-three-announce">
            <h3>{announce}</h3>
          </div>
        </Link>
      )}
      {actor && (
        <div className="user-profile__contestant-wrapper">
          <div className=" vote-video-container">
            <VideoPlayer videoUrl={videoSrc} />
          </div>
          <Link to={`/actors/vote/${actorId}`} className="link-style">
            <div className="vote-user-info">
              <div className="vote-user-details">
                <h2>{actor.name}</h2>
                <p className="vote-user-description">{actor.description}</p>
              </div>
              <div className="vote-user-image-container">
                <img
                  src={actor.url_photo}
                  alt={actor.name}
                  className="vote-user-headshot"
                />
              </div>
            </div>
          </Link>
        </div>
      )}
      
    </section>
  );
}

export default VoteProfile;
