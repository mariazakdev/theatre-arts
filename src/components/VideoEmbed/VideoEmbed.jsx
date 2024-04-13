
import React, { useRef, useState } from 'react';
import Vimeo from '@vimeo/player';
import VimeoPlayer from 'react-player/vimeo';
import YouTube from 'react-youtube';
import { TikTok } from 'react-tiktok';
import InstagramEmbed from './InstagramEmbed';
import './VideoEmbed.scss';

function VideoEmbed({ videoUrl }) {
  const [videoPlayed, setVideoPlayed] = useState(false);
  const playerRef = useRef(null);

  const restartVideo = () => {
    if (playerRef.current) {
      if (playerRef.current.seekTo) {
        playerRef.current.seekTo(0); // Restart the video
      }
      setVideoPlayed(false); // Reset videoPlayed state
    }
  };

  const handleVideoStateChange = (event) => {
    if (event === "playing" && !videoPlayed) {
      setTimeout(() => {
        restartVideo();
      }, 60000); // Restart after 60 seconds
    }
  };

  const constructFacebookEmbedUrl = (videoUrl) => {
    const match = videoUrl.match(/videos\/(\d+)/);
    if (match && match[1]) {
      const videoId = match[1];
      return `https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2F${videoId}%2F&show_text=false&width=380&t=0`;
    } else {
      return null; // Return null if video ID couldn't be extracted
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
            if (state.playedSeconds >= 60 && !videoPlayed) {
              setVideoPlayed(true);
              restartVideo();
            }
          }}
          ref={playerRef}
        />
      )}
          {videoUrl && videoUrl.includes('tiktok') && (
        <TikTok
          url={videoUrl}
          className="horizontal-video"
          onPause={() => setVideoPlayed(true)}
        />
      )}
        {videoUrl && videoUrl.includes('instagram') && (
        <div className="instagram-video">
          <iframe
            src={videoUrl + "/embed"}
            width="500"
            height="280"
            frameBorder="0"
            allowFullScreen
            title="Embedded Instagram Video"
          ></iframe>
        </div>
      )}
   {/* {videoUrl && videoUrl.includes('facebook') && (
     <div className="facebook-video">
     <iframe
       src={videoUrl}
       
       width="500"
       height="280"
       frameBorder="0"
       allowFullScreen
       title="Embedded Facebook Video"
     ></iframe>
   </div>
      )} */}


      {/* {videoUrl && videoUrl.includes('facebook') && (
  <div className="facebook-video">
<iframe 
src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Flaura.clery%2Fvideos%2F300514665666768%2F&show_text=false&width=380&t=0" 
width="380" 
height="476" 
scrolling="no" 
frameborder="0" 
allowfullscreen="true" 
allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" 
allowFullScreen="true"

></iframe>
  </div>
)} */}
      {/* Embedding Facebook video using constructed dynamic URL */}
      {videoUrl && videoUrl.includes('facebook') && (
  <div className="facebook-video">
    <iframe
      src={constructFacebookEmbedUrl(videoUrl)}
      width="500"
      height="280"
      frameBorder="0"
      allowFullScreen
      title="Embedded Facebook Video"
    ></iframe>
  </div>
)}

    </>
  );
}

export default VideoEmbed;
