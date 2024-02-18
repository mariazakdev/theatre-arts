import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import useTopThree from "../../hooks/useTopThree";
import YouTube from "react-youtube";
import PlayIcon from "../../assets/icons/Icons8-Ios7-Media-Controls-Play.512.png";
import StopIcon from "../../assets/icons/Icons8-Ios7-Media-Controls-Stop.512.png";
import RestartIcon from "../../assets/icons/Icons8-Ios7-Media-Controls-Repeat.512.png";
import "./UserProfile.scss";

const URL = process.env.REACT_APP_BACKEND_URL;

function UserProfile() {
  const { actorId } = useParams();
  const [localActorData, setLocalActorData] = useState(null);
  const [announce, setAnnounce] = useState(null);
  const [videoPlayed, setVideoPlayed] = useState(false);
  const [volume, setVolume] = useState(100);
  const [elapsedTime, setElapsedTime] = useState(0);
  const playerRef = useRef(null);
  const { groupedContestants, topThreeMessages } = useTopThree(); // Assuming this hook returns relevant data

  // Fetch contestant data
  useEffect(() => {
    if (!actorId) {
      console.error("No actor ID provided");
      return;
    }

    const fetchActorData = async () => {
      try {
        const response = await axios.get(`${URL}/contestants/${actorId}`);
        setLocalActorData(response.data);
      } catch (error) {
        console.error("Error fetching actor data:", error);
      }
    };

    fetchActorData();
  }, [actorId]);

  // Check if the contestant is in the top three of their group
  useEffect(() => {
    if (groupedContestants && groupedContestants.length > 0 && actorId) {
      groupedContestants.forEach((group) => {
        group.forEach((contestant) => {
          if (contestant.id === parseInt(actorId)) {
            setAnnounce(contestant.announce);
          }
        });
      });
    }
  }, [groupedContestants, actorId]);

  // Stop video after 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const currentTime = playerRef.current.getCurrentTime();
        setElapsedTime(currentTime);
        if (currentTime >= 60) {
          setVideoPlayed(true);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle video state change
  const handleVideoStateChange = (event) => {
    if (event.data === YouTube.PlayerState.PLAYING && !videoPlayed) {
      setTimeout(() => {
        event.target.pauseVideo();
        setVideoPlayed(true);
      }, 60000); // Pause at 60 seconds (1 minute)
    }
  };

  // Restart video
  const handleRestart = () => {
    if (playerRef.current) {
      const player = playerRef.current.internalPlayer;
      player.seekTo(0); // Restart the video
      player.playVideo();
      setVideoPlayed(false); // Reset video played state
    }
  };

  // Stop video
  const handleStop = () => {
    if (playerRef.current) {
      const player = playerRef.current.internalPlayer;
      player.pauseVideo();
      setVideoPlayed(true);
    }
  };

  // Play video
  const handlePlay = () => {
    if (playerRef.current) {
      const player = playerRef.current.internalPlayer;
      player.playVideo();
    }
  };

  if (!localActorData) {
    return <div>Loading...</div>;
  }

  const actor = localActorData;
  const videoSrc = actor.url_video
    ? actor.url_video.replace("watch?v=", "embed/")
    : "";

  return (
    <section className="user-profile">
      {topThreeMessages && (
        <div className="top-three-messages">
          {topThreeMessages.map((message) => (
            <div key={message.id}>{message.text}</div>
          ))}
        </div>
      )}
      {announce && (
        <div className="user-profile__top-three-announce">
          <h3>{announce}</h3>
        </div>
      )}
      {actor && (
        <div className="user-profile__wrapper">
          <div className="video-container">
            {videoSrc && (
              <YouTube
                videoId={videoSrc.split("/").pop()}
                opts={{
                  playerVars: {
                    autoplay: 0,
                    controls: 0,
                    volume: volume / 100,
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
            <div className="custom-controls">
              <div className="custom-controls__icons">
                <img
                  src={PlayIcon}
                  onClick={handlePlay}
                  alt="Play"
                  // className={videoPlayed ? "disabled" : ""}
                />
              </div>
              <div className="custom-controls__icons">
                <img src={StopIcon} onClick={handleStop} alt="Stop" />
              </div>
              <div className="custom-controls__icons">
                <img
                  src={RestartIcon}
                  onClick={handleRestart}
                  alt="Restart"
                />
              </div>
            </div>
          </div>
          <div className="user-info">
            <div className="user-details">
              <h2>{actor.name}</h2>
              <p className="user-description">{actor.description}</p>
              <p className="user-votes">Votes: {actor.votes}</p>
            </div>
            <div className="user-image-container">
              <img
                src={actor.url_photo}
                alt={actor.name}
                className="user-headshot"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default UserProfile;
