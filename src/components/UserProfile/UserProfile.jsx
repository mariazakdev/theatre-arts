import React from 'react';
import { useLocation } from 'react-router-dom';
import './UserProfile.scss';
import VideoCard from '../VideoCard/VideoCard';

function UserProfile() {
  const location = useLocation();
    const actor = location.state?.actor;

    if (!actor) {
        return <div>Loading...</div>;
    }

     return (
        <div className="user-profile">
            <h2>{actor.name}</h2>
            <img src={actor.url_photo} alt={actor.name} className="user-headshot" />
            <p className="user-description">{actor.description}</p>
            <div className="user-videos">
            <iframe 
                            src={actor.url_video.replace("watch?v=", "embed/")} 
                            title="YouTube video player" 
                            frameBorder="0" 
                            allowFullScreen 
                            className="card-video"
                        ></iframe>                {actor.videos?.map(video => (
                    <VideoCard key={video.url} video={video} />
                ))}
            </div>
        </div>
    );
}

export default UserProfile;
