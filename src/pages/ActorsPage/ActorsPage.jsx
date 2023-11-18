import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ActorsPage.scss';

function ActorsPage() {
    const [videoData, setVideoData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8000/upload')
            .then(response => {
                setVideoData(response.data); 
            })
            .catch(error => {
                console.error('There was an error fetching the video data:', error);
            });
    }, []);

    const handleCardClick = (video) => {
        navigate(`/actors/vote/${video.id}`, { state: { actor: video } });
    };
    
    return (
        <div className="video-list-container">
            <h1>Users and their Videos</h1>
            <div className="cards-container">

                
                {videoData.map(video => (
                    <div 
                        key={video.user_id} 
                        className="card"
                        onClick={() => handleCardClick(video)}
                    >
                        <div className="card-content">
                            <h2 className="card-title">{video.name}</h2>
                            <img src={video.url_photo} alt={video.name} className="card-image"/>
                            <p className="card-description">{video.description}</p>
                            <p className="card-votes">Votes: {video.votes}</p>
                        </div>

                    </div> 
                ))}




            </div>
        </div>
    );
}

export default ActorsPage;
