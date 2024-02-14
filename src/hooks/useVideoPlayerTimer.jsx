import { useState, useEffect, useRef } from 'react';

const useVideoPlayerTimer = (videoUrl) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    const timer = setTimeout(() => {
      if (video && !video.paused) {
        video.pause();
        setIsPlaying(false);
      }
    }, 60000); // 1 minute in milliseconds

    return () => clearTimeout(timer);
  }, [isPlaying]);

  const handlePlay = () => {
    const video = videoRef.current;
    if (video) {
      video.play();
      setIsPlaying(true);
    }
  };

  return { videoRef, isPlaying, handlePlay };
};

export default useVideoPlayerTimer;


// use in component:
// import React from 'react';
// import useVideoPlayer from './useVideoPlayer';

// const MyComponent = () => {
//   const { videoRef, isPlaying, handlePlay } = useVideoPlayer('your-video-url.mp4');

//   return (
//     <div>
//       <video ref={videoRef} width="320" height="240" controls>
//         <source src="your-video-url.mp4" type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>
//       <button onClick={handlePlay}>Play Video</button>
//     </div>
//   );
// };

// export default MyComponent;
