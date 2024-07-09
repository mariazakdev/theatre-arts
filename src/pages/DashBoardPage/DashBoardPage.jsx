import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import VideoPlayer from "../../components/VideoEmbed/VideoEmbed";
import EditDashboard from "../../components/EditDashBoard/EditDashBoard";
import "./DashBoardPage.scss";
import DashBoardVoterComponent from "../../components/DashBoardVoterComponent/DashBoardVoterComponent";
import DashboardSeeGroups from "../../components/DashboardSeeGroups/DashaboardSeeGroups";


export default function Dashboard({ URL , API_KEY}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [contestants, setContestants] = useState([]);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [votes, setVotes] = useState([]);

  // Check permissions and redirect if necessary
  useEffect(() => {
    const fetchUserDashboard = async () => {
      try {
        if (!currentUser) {
          console.log("User not found, redirecting to home");
          setError("User not found");
          navigate("/");
          return;
        }

        const response = await axios.get(`${URL}/users/${currentUser.uid}`,
        { headers: 
          { Authorization: `${API_KEY}` 
        } });

        const data = response.data;
        const user = data.user;

        if (user.is_contestant === 0) {
          setError("User is not a contestant");
          navigate("/");
          return;
        }
        // Only after upload process
        const contestant = data.contestant;

        if (user.is_contestant === 1 && user.hasPaid === 0 && user.uploadStatus === 0) {
          navigate("/contestant/enter");
          return;
        }

        if (user.is_contestant === 1 && user.uploadStatus === 0 && user.hasPaid === 1) {
          navigate("/contestant/upload");
          return;
        }

        if ( user.is_contestant === 1  && user.uploadStatus === 1 && user.hasPaid === 1) {
          // Set loading to false since the data is already available
          setLoading(false);
        }

        if (!contestant) {
          setLoading(false); // Set loading to false as there is no contestant data yet
          return;
        }

        setContestants(contestant);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data: ", error);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchUserDashboard();
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await axios.get(`${URL}/votes-tracker/contestant/${contestants.id}`, {
          headers: { Authorization: `${API_KEY}` }
        });
        setVotes(response.data);
      } catch (error) {
        console.error("Error fetching votes data: ", error);
        setError("Failed to load votes data");
      }
    };

    if (contestants.id) {
      fetchVotes();
    }
  }, [contestants.id, URL, API_KEY]);

  async function handleLogout() {
    setError("");
    try {
      await logout();
      navigate("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  const toggleEditing = () => {
    setIsEditing((prevIsEditing) => !prevIsEditing);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const updateContestantData = async () => {
    try {
      const response = await axios.get(`${URL}/users/${currentUser.uid}`, 
      { headers: { Authorization: `${API_KEY}` } 
    });
      const data = response.data;

      if (data.contestant) {
        setContestants(data.contestant);
      } else {
        setError("No contestant found for this user");
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching updated contestant data: ", error);
      setError("Failed to load updated contestant data");
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard__content">
        <h2 className="dashboard__content__title">Dashboard</h2>
 
        {/* Contestant Data */}
        <div className="dashboard__content__user-data">
          <div className="dashboard__content__user-data__details">


           {contestants && (
  <div key={contestants.id} className="user-data-details__user-details">
    {/* Link to user profile */}
    <Link to={`/actors/vote/${contestants.id}`} className="link-style">
   <button className="link-style__vote-button">Go to profile</button>
    <h3 className="dashboard__user-name">{contestants.name}</h3>
      <p className="dashboard__user-description">
        {contestants.description}
      </p>
      <img
        src={contestants.url_photo}
        alt={contestants.name}
        className="dashboard__user-photo"
      />
      <p className="dashboard__user-votes">
        Votes: {contestants.votes}
      </p>
    </Link>
  </div>
)}

          </div>
          <div className="dashboard__content__user-data__vid">
            {contestants && contestants.url_video && (
              <VideoPlayer
                videoUrl={contestants.url_video.replace("watch?v=", "embed/")}
              />
            )}
          </div>
    
        </div>
        <button onClick={handleLogout} className="dashboard__logout-button">
          Log Out
        </button>

        {isEditing && (
          <EditDashboard
            URL={URL}
            contestantId={contestants.id}
            toggleEditing={toggleEditing}
            updateContestantData={updateContestantData}
            API_KEY={API_KEY}
          />
        )}
           <button onClick={toggleEditing} className="dashboard__edit-button">
          {isEditing ? "Cancel Edit" : "Edit"}
        </button>
        
        <DashBoardVoterComponent votes={votes} />
     
        <DashboardSeeGroups 
  URL={process.env.REACT_APP_BACKEND_URL} 
  API_KEY={process.env.REACT_APP_API_KEY} 
  contestantId={contestants.id}
/>
        {error && <p className="dashboard__error">{error}</p>}
      </div>
    </div>
  );
}
