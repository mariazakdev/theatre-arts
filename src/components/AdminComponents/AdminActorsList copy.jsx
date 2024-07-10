import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminActorsList.scss";

function AdminActorsList({ URL, API_KEY }) {
  const [videoData, setVideoData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState("votes");
  const [newRoundNumber, setNewRoundNumber] = useState('');
  const [newGroupNumber, setNewGroupNumber] = useState('');

  useEffect(() => {
    fetchVideoData();
  }, []);

  const fetchVideoData = () => {
    axios
      .get(`${URL}/contestants`, {
        headers: {
          Authorization: `${API_KEY}`,
        },
      })
      .then((response) => {
        setVideoData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the video data:", error);
        setLoading(false);
      });
  };

  const handleCardClick = (video) => {
    navigate(
      `/actors/vote/${video.id}`,
      { state: { actor: video } },
      {
        headers: {
          Authorization: `${API_KEY}`,
        },
      }
    );
  };

  const handleDeleteClick = (contestantId) => {
    console.log(`Attempting to delete contestant with ID: ${contestantId}`); // Add logging
    axios
      .delete(`${URL}/contestants/${contestantId}`, {
        headers: {
          Authorization: `${API_KEY}`,
        },
      })
      .then(() => {
        setVideoData((prevData) => prevData.filter((video) => video.id !== contestantId));
        alert("Actor deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting contestant:", error);
      });
  };

  const handleToggleActive = (actorId, currentActive) => {
    const newActiveStatus = currentActive === 1 ? 0 : 1;
    axios
      .put(
        `${URL}/contestants/active/${actorId}`,
        { active: newActiveStatus },
        {
          headers: {
            Authorization: `${API_KEY}`,
          },
        }
      )
      .then(() => {
        setVideoData((prevData) =>
          prevData.map((video) =>
            video.id === actorId ? { ...video, active: newActiveStatus } : video
          )
        );
        alert(
          `Contestant ${
            newActiveStatus ? "activated" : "deactivated"
          } successfully!`
        );
      })
      .catch((error) => {
        console.error(
          `Error updating active status for contestant ${actorId}:`,
          error
        );
      });
  };

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
    let filteredData = [...videoData];
    switch (filter) {
      case "votes":
        filteredData.sort((a, b) => b.votes - a.votes);
        break;
      case "alphabetical":
        filteredData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "active":
        filteredData = videoData.filter((video) => video.active === 1);
        break;
      case "inactive":
        filteredData = videoData.filter((video) => video.active === 0);
        break;
      case "topOrder":
        filteredData.sort((a, b) => {
          if (a.active === 1 && b.active === 0) return -1; // Active users first
          if (a.active === 0 && b.active === 1) return 1; // Inactive users last
          return 0;
        });
      default:
        break;
    }
    setVideoData(filteredData);
  };

    // ROUND ADJUSTMENT FUNCTIONS FOR INDIVIDUALS

  const handleIndividualRoundUpdate = (actorId, newRoundNumber) => {
    axios.put(`${URL}/contestants/${actorId}/update-round`, { roundNumber: newRoundNumber }, {
      headers: {
        Authorization: `${API_KEY}`,
      },
    })
      .then(response => {
        console.log(`Round number for actor with ID ${actorId} updated to ${newRoundNumber}`);
        alert(response.data.message);
        fetchVideoData(); // Refresh data
      })
      .catch(error => {
        console.error("There was an error updating the round number:", error);
      });
  };

const handleRoundInputChange = (actorId, value) => {
    setVideoData((prevData) =>
      prevData.map((video) =>
        video.id === actorId ? { ...video, newRoundNumber: value } : video
      )
    );
  };

  // GROUP ADJUSTMENT FUNCTIONS FOR INDIVIDUALS
  const handleIndividualGroupUpdate = (actorId, newGroupNumber) => {
    axios.put(`${URL}/contestants/${actorId}/update-group`, { groupNumber: newGroupNumber }, {
      headers: {
        Authorization: `${API_KEY}`,
      },
    })
      .then(response => {
        console.log(`Group number for actor with ID ${actorId} updated to ${newGroupNumber}`);
        alert(response.data.message);
        fetchVideoData(); // Refresh data
      })
      .catch(error => {
        console.error("There was an error updating the group number:", error);
      });
  };

  const handleGroupInputChange = (actorId, value) => {
    setVideoData((prevData) =>
      prevData.map((video) =>
        video.id === actorId ? { ...video, newGroupNumber: value } : video
      )
    );
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-actor">
      <h1>Users and their Videos</h1>
      <div className="filter-buttons">
        <button onClick={() => handleFilterChange("votes")}>Most Votes</button>
        <button onClick={() => handleFilterChange("alphabetical")}>
          Alphabetical Order
        </button>
        <button onClick={() => handleFilterChange("active")}>Active</button>
        <button onClick={() => handleFilterChange("inactive")}>Inactive</button>
        <button onClick={() => handleFilterChange("topOrder")}>
          Top Order
        </button>
      </div>
      <div className="admin-actor__cards">
        {videoData.map((video) => (
          <div key={video.id} className="admin-actor__card">
            <div className="admin-actor__card-header">
              <h2 className="admin-actor__card-title">{video.name}</h2>
              <img
                src={video.url_photo}
                alt={video.name}
                className="admin-actor__card-image"
              />
            </div>
            <div className="admin-actor__card-body">
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
                <p>{video.active === 1 ? "Active" : "Inactive"}</p>
              </div>
              {video.url_video && (
                <iframe
                  title="Contestant Video"
                  src={video.url_video.replace("watch?v=", "embed/")}
                  allowFullScreen
                  className="admin-actor__card-video"
                ></iframe>
              )}
              <div className="admin-actor__card-extra">
                <p className="admin-actor__card-votes">Votes: {video.votes}</p>
                <p className="admin-actor__card-round">Round: {video.round}</p>
                <p className="admin-actor__card-group">Group: {video.group_number}</p>

                <div className="admin-actor__card-actions">

{/* CONTESTANT ROUND */}
<div className="admin-actor__card-update">
                    <input
                      type="number"
                      value={video.newRoundNumber}
                      onChange={(e) => handleRoundInputChange(video.id, e.target.value)}
                      placeholder="New round number"
                    />
                    <button onClick={() => handleIndividualRoundUpdate(video.id, video.newRoundNumber)}>Update Round</button>
                  </div>

{/* CONTESTANT ROUND */}

<div className="admin-actor__card-update">
                    <input
                      type="number"
                      value={video.newGroupNumber || ''}
                      onChange={(e) => handleGroupInputChange(video.id, e.target.value)}
                      placeholder="New group number"
                    />
                    <button onClick={() => handleIndividualGroupUpdate(video.id, video.newGroupNumber)}>Update Group</button>
                  </div>

{/* DELETE CONTESTANT AND USER FROM SITE */}
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteClick(video.id)}
                  >
                    Delete
                  </button>
                
{/* ACTIVATE OR DEACTIVATE CONTESTANT, NO USER ACCESS */}
                  <button
                    className="toggle-active-button"
                    onClick={() => handleToggleActive(video.id, video.active)}
                  >
                    {video.active === 1 ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminActorsList;
