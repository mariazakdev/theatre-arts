import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ContestantStanding from "../ContestantStanding/ContestantStanding";
import AdminSunKingEdit from "./AdminSunKingEdit";
import "../../pages/AdminPage/AdminPage.scss";


const URL = process.env.REACT_APP_BACKEND_URL;

function AdminActorsList() {
    const [videoData, setVideoData] = useState([]);
    const navigate = useNavigate();
  
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
  
    return (
      <div className="admin-list-container">
        <h1>Users and their Videos</h1>
        <ContestantStanding URL={URL} />
        <div className="admin-cards-container">
          <AdminSunKingEdit />
          {videoData.map((video) => (
            <div
              key={video.user_id}
              className="admin-card"
              onClick={() => handleCardClick(video)}
            >
              <div className="admin-card-content">
                <h2 className="card-title">{video.name}</h2>
                <img
                  src={video.url_photo}
                  alt={video.name}
                  className="card-image"
                />
                <p className="card-description">{video.url_video}</p>
                <p className="card-description">{video.description}</p>
                <p className="card-votes">Votes: {video.votes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}

export default AdminActorsList
