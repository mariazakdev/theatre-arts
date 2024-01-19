import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./UserProfile.scss";

function UserProfile() {
  const { actorId } = useParams();
  const [localActorData, setLocalActorData] = useState(null);

  useEffect(() => {
    if (!actorId) {
      console.error("No actor ID provided");
      // Handle missing actorId as needed
      return;
    }

    const fetchActorData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/upload/${actorId}`
        );
        setLocalActorData(response.data);
      } catch (error) {
        console.error("Error fetching actor data:", error);
        // Handle errors (e.g., actor not found, server error)
      }
    };

    fetchActorData();
  }, [actorId]);

  if (!localActorData) {
    return <div>Loading...</div>;
  }

  const actor = localActorData;
  const videoSrc = actor.url_video
    ? actor.url_video.replace("watch?v=", "embed/")
    : "";

  return (
    <section className="user-profile">
      {actor && (
        <>
          <div className="video-container">
            {videoSrc && (
              <iframe
                src={videoSrc}
                title="YouTube video player"
                allowFullScreen
                className="video-frame"
              ></iframe>
            )}
          </div>
          <div className="user-info">
            <div className="user-details">
              <h2>{actor.name}</h2>
              <p className="user-description">{actor.description}</p>
            </div>
            <div className="user-image-container">
              <img
                src={actor.url_photo}
                alt={actor.name}
                className="user-headshot"
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default UserProfile;