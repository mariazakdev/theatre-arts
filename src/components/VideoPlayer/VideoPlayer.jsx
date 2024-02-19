import React, { useEffect, useRef, useState } from 'react';
import YouTube from "react-youtube";
import VimeoPlayer from 'react-player/vimeo';
import { TikTok } from 'react-tiktok'; // Import TikTok component

function VideoPlayer({ videoUrl }) {
  const [videoPlayed, setVideoPlayed] = useState(false);
  const playerRef = useRef(null);

  const restartVideo = () => {
    if (playerRef.current) {
      if (playerRef.current.seekTo) {
        playerRef.current.seekTo(0); // Restart the video
        playerRef.current.getInternalPlayer().then(player => player.pause());
      }
      setVideoPlayed(true);
    }
  };

  const handleVideoStateChange = (event) => {
    if (event === "playing" && !videoPlayed) {
      setTimeout(() => {
        restartVideo();
      }, 15000); // Restart after 15 seconds
    }
  };

  return (
    <>
      {videoUrl && videoUrl.includes('youtube') && (
        <YouTube
          videoId={videoUrl.split('/').pop()}
          opts={{
            playerVars: {
              autoplay: 0, 
              controls: 0,
              volume: 100,
              rel: 0,
              end: 60,
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
            if (state.playedSeconds >= 15 && !videoPlayed) {
              setVideoPlayed(true);
              restartVideo();
            }
          }}
          ref={playerRef}
        />
      )}
      {videoUrl && videoUrl.includes('tiktok') && (
        <TikTok url={videoUrl} />
      )}
    </>
  );
}

export default VideoPlayer;
