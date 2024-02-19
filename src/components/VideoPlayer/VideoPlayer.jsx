
import React, { useEffect, useRef, useState } from 'react';
import YouTube from "react-youtube";
import VimeoPlayer from 'react-player/vimeo';

function VideoPlayer({ videoUrl }) {
  const [videoPlayed, setVideoPlayed] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const currentTime = playerRef.current.getCurrentTime();
        if (currentTime >= 60 && !videoPlayed) {
          if (playerRef.current.seekTo) {
            playerRef.current.seekTo(0); // Restart the video
            playerRef.current.play(); // Resume playing
          } else if (playerRef.current.pauseVideo) {
            playerRef.current.pauseVideo();
          } else if (playerRef.current.pause) {
            playerRef.current.pause();
          }
          setVideoPlayed(true);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [videoPlayed]);



  const handleVideoStateChange = (event) => {
    if (event.data === 1 && !videoPlayed) {
      setTimeout(() => {
        if (playerRef.current.seekTo) {
          playerRef.current.seekTo(0); // Restart the video
          playerRef.current.play(); // Resume playing
        } else if (playerRef.current.pauseVideo) {
          playerRef.current.pauseVideo();
        } else if (playerRef.current.pause) {
          playerRef.current.pause();
        }
        setVideoPlayed(true);
      }, 60000); // Pause at 60 seconds (1 minute)
    }
  };

  return (
    <>
      {videoUrl && videoUrl.includes('youtube') && (
        <YouTube
          videoId={videoUrl.split('/').pop()}
          opts={{
            playerVars: {
              autoplay: 0, // Automatically start playing
              controls: 0,
              volume: 100,
              rel: 0,
            },
          }}
          onReady={(event) => {
            event.target.pauseVideo();
          }}
          onStateChange={handleVideoStateChange}
          ref={playerRef}
        />
      )}
      {videoUrl && videoUrl.includes('vimeo') && (
        <VimeoPlayer
          url={videoUrl}
          controls={true}
          onPause={() => setVideoPlayed(true)}
          onProgress={(state) => {
            if (state.playedSeconds >= 60 && !videoPlayed) {
              setVideoPlayed(true);
            }
          }}
        />
      )}
    </>
  );
}

export default VideoPlayer;

  