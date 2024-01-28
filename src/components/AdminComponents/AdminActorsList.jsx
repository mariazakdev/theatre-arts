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
    axios
      .get(`${URL}/contestants`)
      .then((response) => {
        setVideoData(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the video data:", error);
      });
  }, [URL]);

  const handleCardClick = (video) => {
    navigate(`/actors/vote/${video.id}`, { state: { actor: video } });
  };

  const handleDeleteClick = (actorId) => {
    axios
      .delete(`${URL}/contestants/${actorId}`)
      .then(() => {
        // Refresh the contestant list after deletion
        axios.get(`${URL}/contestants`).then((response) => {
          setVideoData(response.data);
        });
      })
      .catch((error) => {
        console.error("Error deleting contestant:", error);
      });
  };
  // Function to handle changing the filter
  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
    // Adjust the sorting logic based on the selected filter
    if (filter === "votes") {
      setVideoData([...videoData].sort((a, b) => b.votes - a.votes));
    } else if (filter === "alphabetical") {
      setVideoData([...videoData].sort((a, b) => a.name.localeCompare(b.name)));
    }
  };

  return (
    <div className="admin-actor">
      <h1>Users and their Videos</h1>
       {/* Filter buttons */}
       <div className="filter-buttons">
        <button onClick={() => handleFilterChange("votes")}>Most Votes</button>
        <button onClick={() => handleFilterChange("alphabetical")}>Alphabetical Order</button>
      </div>
      {/* List of actors */}
      <div className="admin-actor__card">
      {videoData.map((video) => (
          <div
            key={video.user_id}
            className="admin-card"
          >
            <div className="admin-actor__card-content">
              <h2 className="card-title">{video.name}</h2>
              <img
                src={video.url_photo}
                alt={video.name}
                className="admin-actor__card-image"
              />
              <div className="admin-actor__card-description">
                <strong>Video Link: </strong>
                <a
                  href={video.url_video}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {video.url_video}
                </a>
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
            <button
                className="see-more-button"
                onClick={() => handleCardClick(video)}
              >
                See More
              </button>
              <button
                className="delete-button"
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this video?")) {
                    handleDeleteClick(video.id);
                    alert("Video deleted successfully!");
                  }
                }}
              >
                Delete
              </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminActorsList;
