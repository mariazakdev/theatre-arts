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
  const [expandedCards, setExpandedCards] = useState([]);


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


  const handleRoundUpdate = () => {
    axios.put(`${URL}/update-round-manually`, { roundNumber: newRoundNumber }, {
      headers: {
        Authorization: `${API_KEY}`,
      },
    })
      .then(response => {
        alert(response.data.message);
      })
      .catch(error => {
        console.error("There was an error updating the round number:", error);
      });
  };

  const handleGroupUpdate = () => {
    axios.put(`${URL}/update-group-manually`, { groupNumber: newGroupNumber }, {
      headers: {
        Authorization: `${API_KEY}`,
      },
    })
      .then(response => {
        alert(response.data.message);
      })
      .catch(error => {
        console.error("There was an error updating the group number:", error);
      });
  };

 const toggleCardExpansion = (id) => {
    setExpandedCards(prev =>
      prev.includes(id) ? prev.filter(cardId => cardId !== id) : [...prev, id]
    );
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  // return (
  //   <div className="admin-actor">
  //     <h1>Users and their Videos</h1>
  //     <div className="filter-buttons">
  //       <button onClick={() => handleFilterChange("votes")}>Most Votes</button>
  //       <button onClick={() => handleFilterChange("alphabetical")}>
  //         Alphabetical Order
  //       </button>
  //       <button onClick={() => handleFilterChange("active")}>Active</button>
  //       <button onClick={() => handleFilterChange("inactive")}>Inactive</button>
  //       <button onClick={() => handleFilterChange("topOrder")}>
  //         Top Order
  //       </button>
  //     </div>
  //     <div className="admin-actor__card">
  //       {videoData.map((video) => (
  //         <div key={video.id} className="admin-card">
  //           <div className="admin-actor__card-content">
  //             <h2 className="card-title">{video.name}</h2>
  //             <img
  //               src={video.url_photo}
  //               alt={video.name}
  //               className="admin-actor__card-image"
  //             />
  //             <div className="admin-actor__card-description">
  //               <strong>Video Link: </strong>
  //               <a
  //                 href={video.url_video}
  //                 target="_blank"
  //                 rel="noopener noreferrer"
  //               >
  //                 {video.url_video}
  //               </a>
  //               <p>{video.description}</p>
  //               <p>{video.active === 1 ? "Active" : "Inactive"}</p>
  //             </div>
  //             {video.url_video && (
  //               <iframe
  //                 title="Contestant Video"
  //                 src={video.url_video.replace("watch?v=", "embed/")}
  //                 allowFullScreen
  //                 className="admin-card-content__video"
  //               ></iframe>
  //             )}
  //             <p className="card-votes">Votes: {video.votes}</p>
  //             <p className="card-round">Round: {video.round}</p>
  //             <p className="card-group">Group: {video.group_number}</p>

  //           </div>
  //           <button
  //             className="see-more-button"
  //             onClick={() => handleCardClick(video)}
  //           >
  //             See More
  //           </button>
  //           <div className="update-round">
  //             <input
  //               type="number"
  //               value={newRoundNumber}
  //               onChange={(e) => setNewRoundNumber(e.target.value)}
  //               placeholder="Enter new round number"
  //             />
  //             <button onClick={handleRoundUpdate}>Update Round Number</button>
  //           </div>

  //           <div className="update-round">
  //       <input
  //         type="number"
  //         value={newRoundNumber}
  //         onChange={(e) => setNewRoundNumber(e.target.value)}
  //         placeholder="Enter new round number"
  //       />
  //       <button onClick={handleRoundUpdate}>Update Round Number</button>
  //     </div>
  //           <button
  //             className="delete-button"
  //             onClick={() => handleDeleteClick(video.id)}
  //           >
  //             Delete
  //           </button>
  //           <button
  //             className="toggle-active-button"
  //             onClick={() => handleToggleActive(video.id, video.active)}
  //           >
  //             {video.active === 1 ? "Deactivate" : "Activate"}
  //           </button>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );
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
            </div>
            {expandedCards.includes(video.id) && (
              <div className="admin-actor__card-extra">
                <p className="admin-actor__card-votes">Votes: {video.votes}</p>
                <p className="admin-actor__card-round">Round: {video.round}</p>
                <p className="admin-actor__card-group">Group: {video.group_number}</p>
                <div className="admin-actor__card-actions">
                  <div className="admin-actor__card-update">
                    <input
                      type="number"
                      value={newRoundNumber}
                      onChange={(e) => setNewRoundNumber(e.target.value)}
                      placeholder="New round number"
                    />
                    <button onClick={handleRoundUpdate}>Update Round</button>
                  </div>
                  <div className="admin-actor__card-update">
                    <input
                      type="number"
                      value={newGroupNumber}
                      onChange={(e) => setNewGroupNumber(e.target.value)}
                      placeholder="New group number"
                    />
                    <button onClick={handleGroupUpdate}>Update Group</button>
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteClick(video.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="toggle-active-button"
                    onClick={() => handleToggleActive(video.id, video.active)}
                  >
                    {video.active === 1 ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            )}
            <button
              className="see-more-button"
              onClick={() => toggleCardExpansion(video.id)}
            >
              {expandedCards.includes(video.id) ? "See Less" : "See More"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminActorsList;
