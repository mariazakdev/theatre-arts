import React from 'react';
import './VideoCard.scss';

function VideoCard({ video }) {
  return (
    <div className="video-card">
      <iframe
        width="560"
        height="315"
        src={video.url}
        title={video.title}
        frameborder="0"
        allowfullscreen
      ></iframe>
      <h4 className="video-title">{video.title}</h4>
      <p className="video-description">{video.description}</p>
    </div>
  );
}

export default VideoCard;
