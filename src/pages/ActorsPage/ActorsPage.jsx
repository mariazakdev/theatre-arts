import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ActorsPage.scss';

function ActorsPage() {
    const [videoData, setVideoData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/upload')
            .then(response => {
                // Assuming the response contains the array of videos
                setVideoData(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the video data:', error);
            });
    }, []); // Empty dependency array ensures this runs once on mount

    return (
        <div className="video-list-container">
            <h1>Users and their Videos</h1>
            <ul>
                {videoData.map(video => (
                    <li key={video.id} className="video-item">
                        <h2>{video.user}</h2>
                        <p><strong>Title:</strong> {video.name}</p>
                        <p><strong>Description:</strong> {video.description}</p>
                        <p><strong>URL:</strong> <a href={video.url} target="_blank" rel="noopener noreferrer">{video.url}</a></p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ActorsPage;
