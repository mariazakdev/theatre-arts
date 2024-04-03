import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import useTopThree from "../../hooks/useTopThree";
import VideoPlayer from "../VideoEmbed/VideoEmbed";
import "./UserProfile.scss";


function UserProfile({ URL, API_KEY}) {
  const { actorId } = useParams();
  const [localActorData, setLocalActorData] = useState(null);
  const [announce, setAnnounce] = useState(null);
  const [videoPlayed, setVideoPlayed] = useState(false);
  const [volume, setVolume] = useState(100);
  const [elapsedTime, setElapsedTime] = useState(0);
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
        const response = await axios.get(`${URL}/contestants/${actorId}`,
          { headers: { Authorization: `${API_KEY}` } }
          );
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
    <section className="user-profile">
      {topThreeMessages && (
        <div className="top-three-messages">
          {topThreeMessages.map((message) => (
            <div key={message.id}>{message.text}</div>
          ))}
        </div>
      )}
      {announce && (
        <div className="user-profile__top-three-announce">
          <h3>{announce}</h3>
        </div>
      )}
      {actor && (
        <div className="user-profile__wrapper">
          <div className="video-container">
          <VideoPlayer videoUrl={videoSrc} /> 
          </div>
          <div className="user-info">
            <div className="user-details">
              <h2>{actor.name}</h2>
              <p className="user-description">{actor.description}</p>
              <p className="user-votes">Votes: {actor.votes}</p>
            </div>
            <div className="user-image-container">
              <img
                src={actor.url_photo}
                alt={actor.name}
                className="user-headshot"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default UserProfile;
