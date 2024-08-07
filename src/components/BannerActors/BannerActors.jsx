import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './BannerActors.scss';

function BannerActors({ URL, API_KEY }) {
  const [videoData, setVideoData] = useState([]);

  useEffect(() => {
    axios.get(`${URL}/contestants`, {
      headers: {
        Authorization: `${API_KEY}`,
      },
    })
      .then(response => {
        setVideoData(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the video data:', error);
      });
  }, [URL, API_KEY]);

  // Function to shuffle the array randomly
  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const activeContestants = videoData.filter(contestant => contestant.active === 1);
  const shuffledVideos = shuffleArray(activeContestants).slice(0, 5);
  const shuffledVideosMobile = shuffleArray(activeContestants).slice(0, 3);

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

      <div className="video-list-container-snippet__cards-container-mobile">
        {shuffledVideosMobile.map((video) => (
          <div key={video.id} className="card-snippet">
            <div className="card-snippet__content">
              <img src={video.url_photo} alt={video.name} className="card-image" />
            </div>
          </div>
        ))}
      </div>

      <div className="video-list-container-snippet__button">
        <Link to="/actors">
          <button className="card-button card-button1">See More</button>
        </Link>
      </div>
    </div>
  );
}

export default BannerActors;
