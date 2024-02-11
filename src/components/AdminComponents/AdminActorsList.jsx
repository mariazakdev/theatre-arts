import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ContestantStanding from "../ContestantStanding/ContestantStanding";
import AdminSunKingEdit from "./AdminSunKingEdit";
import "./AdminActorsList.scss";

const URL = process.env.REACT_APP_BACKEND_URL;

function AdminActorsList() {
  const [videoData, setVideoData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState("votes"); 

  useEffect(() => {
    fetchVideoData();
  }, []);

  const fetchVideoData = () => {
    axios
      .get(`${URL}/contestants`)
      .then((response) => {
        setVideoData(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the video data:", error);
      });
  };

  const handleCardClick = (video) => {
    navigate(`/actors/vote/${video.id}`, { state: { actor: video } });
  };

  const handleDeleteClick = (actorId) => {
    axios
      .delete(`${URL}/contestants/${actorId}`)
      .then(() => {
        fetchVideoData();
        alert("Video deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting contestant:", error);
      });
  };

  const handleToggleActive = (actorId, currentActive) => {
    const newActiveStatus = currentActive === 1 ? 0 : 1;
    axios
      .put(`${URL}/contestants/active/${actorId}`, { active: newActiveStatus })
      .then(() => {
        fetchVideoData();
        alert(`Contestant ${newActiveStatus ? "activated" : "deactivated"} successfully!`);
      })
      .catch((error) => {
        console.error(`Error updating active status for contestant ${actorId}:`, error);
      });
  };

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
    if (filter === "votes") {
      setVideoData([...videoData].sort((a, b) => b.votes - a.votes));
    } else if (filter === "alphabetical") {
      setVideoData([...videoData].sort((a, b) => a.name.localeCompare(b.name)));
    }
  };

  return (
    <div className="admin-actor">
      <h1>Users and their Videos</h1>
      <div className="filter-buttons">
        <button onClick={() => handleFilterChange("votes")}>Most Votes</button>
        <button onClick={() => handleFilterChange("alphabetical")}>Alphabetical Order</button>
      </div>
      <div className="admin-actor__card">
        {videoData.map((video) => (
          <div key={video.id} className="admin-card">
            <div className="admin-actor__card-content">
              <h2 className="card-title">{video.name}</h2>
              <img src={video.url_photo} alt={video.name} className="admin-actor__card-image" />
              <div className="admin-actor__card-description">
                <strong>Video Link: </strong>
                <a href={video.url_video} target="_blank" rel="noopener noreferrer">{video.url_video}</a>
                <p>{video.description}</p>
              </div>
              {video.url_video && (
                <iframe
                  title="Contestant Video"
                  src={video.url_video.replace("watch?v=", "embed/")}
                  allowFullScreen
                  className="admin-card-content__video"
                ></iframe>
              )}
              <p className="card-votes">Votes: {video.votes}</p>
            </div>
            <button className="see-more-button" onClick={() => handleCardClick(video)}>See More</button>
            <button className="delete-button" onClick={() => handleDeleteClick(video.id)}>Delete</button>
            <button className="toggle-active-button" onClick={() => handleToggleActive(video.id, video.active)}>
              {video.active === 1 ? "Deactivate" : "Activate"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminActorsList;
