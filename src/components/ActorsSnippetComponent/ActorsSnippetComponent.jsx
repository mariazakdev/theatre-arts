import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ActorsSnippetComponent.scss';

function ActorsSnippetComponent() {
  const [videoData, setVideoData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/contestants')
      .then(response => {
        setVideoData(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the video data:', error);
      });
  }, []);

  // Function to shuffle the array randomly
  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const shuffledVideos = shuffleArray(videoData).slice(0, 5);

  return (
    <div className="video-list-container-snippet">
      <div className="video-list-container-snippet__cards-container">
        {shuffledVideos.map((video) => (
          <div key={video.id} className="card-snippet">
            <div className="card-snippet__content">
              <img src={video.url_photo} alt={video.name} className="card-image" />
            </div>
          </div>
        ))}
      </div>
      <Link to="/actors">
          <button className="card-button card-button1">See More</button>
        </Link>
    </div>
  );
}

export default ActorsSnippetComponent;

