import React, { useState, useEffect } from "react";
import axios from 'axios'; // Make sure to import axios
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./UserProfile.scss";

function UserProfile() {
  const { actorId } = useParams();
  const [localActorData, setLocalActorData] = useState(null);

  useEffect(() => {
    if (!actorId) {
      console.error('No actor ID provided');
      // Handle missing actorId as needed
      return;
    }

    const fetchActorData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/upload/${actorId}`);
        setLocalActorData(response.data);
      } catch (error) {
        console.error('Error fetching actor data:', error);
        // Handle errors (e.g., actor not found, server error)
      }
    };

    fetchActorData();
  }, [actorId]);

  if (!localActorData) {
    return <div>Loading...</div>; // or handle the loading state appropriately
  }

  const actor = localActorData;
  const videoSrc = actor.url_video ? actor.url_video.replace("watch?v=", "embed/") : '';

  return (
    <section className="user-profile">
      <div className="user-profile__data">
        {actor && (
          <>
            <h2>{actor.name}</h2>
            <h2>{actor.votes}</h2>

            <img src={actor.url_photo} alt={actor.name} className="user-headshot" />
            <p className="user-description">{actor.description}</p>
            <div className="user-videos">
              {videoSrc && (
                <iframe
                  src={videoSrc}
                  title="YouTube video player"
                  allowFullScreen
                  className="card-video"
                ></iframe>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default UserProfile;
