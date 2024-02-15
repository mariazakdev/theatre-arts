import React, { useState, useEffect, useRef } from 'react';

function useStopVideoAtTime(videoRef, stopTime) {
  const [shouldPause, setShouldPause] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && videoRef.current.currentTime >= stopTime) {
        videoRef.current.pause();
        setShouldPause(true);
      }
    }, 100); // adjust interval as needed

    return () => clearInterval(interval);
  }, [videoRef, stopTime]);

  return shouldPause;
}

function VideoPlayer() {
  const videoRef = useRef(null);
  const shouldPause = useStopVideoAtTime(videoRef, 30); // Stop at 30 seconds

  return (
    <div>
      <video ref={videoRef} controls>
        <source src="your-video-source.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {shouldPause && <p>Video stopped at given time.</p>}
    </div>
  );
}

export default VideoPlayer;
