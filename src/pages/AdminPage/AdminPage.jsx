import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext"; 
import { useNavigate } from "react-router-dom";
import AdminActorsList from "../../components/AdminComponents/AdminActorsList";
import AdminSunKingEdit from "../../components/AdminComponents/AdminSunKingEdit";
import AdminVotingStandings from "../../components/AdminComponents/AdminVotingStandings";
import AdminUsersList from "../../components/AdminComponents/AdminUsersList";
import useTopThree from "../../hooks/useTopThree"; // Import the custom hook
import AdminDeactivateNonRankButton from "../../components/AdminComponents/AdminDeactivateNonRankButton";
import AdminRegroupContestantsButton from "../../components/AdminComponents/AdminRegroupContestantsButton";
import AdminResetVotesButton from "../../components/AdminComponents/AdminResetVotesButton";
import AdminUpdateRoundButton from "../../components/AdminComponents/AdminUpdateRoundButton";
import AdminResetVotesTrackerButton from "../../components/AdminComponents/AdminResetVotesTrackerButton";

import "./AdminPage.scss";

function AdminPage({ URL, API_KEY }) {
  const [activeTab, setActiveTab] = useState("actors");
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { groupedContestants, topThreeMessages, totalContestants, remainderContestants } = useTopThree(); // Use the custom hook

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (currentUser) {
          const response = await axios.get(`${URL}/users/${currentUser.uid}`, {
            headers: { Authorization: `${API_KEY}` },
          });
          const user = response.data.user;
          if (user.is_admin === 1) {
            // User is an admin, do nothing
          } else if (user.is_admin === 0) {
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [currentUser, navigate]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="admin-list-container">
      <h1>Users and their Videos</h1>
      <h2>Update Buttons only for Maria to use</h2>
      {/* Timer button */}
      {/* <AdminGroupsCounter URL={URL} API_KEY={API_KEY}/>  */}
      <AdminDeactivateNonRankButton URL={URL} API_KEY={API_KEY}  />
      <AdminResetVotesButton URL={URL} API_KEY={API_KEY} />
      <AdminRegroupContestantsButton URL={URL} API_KEY={API_KEY} />
      <AdminUpdateRoundButton URL={URL} API_KEY={API_KEY} /> 
     <AdminResetVotesTrackerButton URL={URL} API_KEY={API_KEY} />

      <div className="admin-navigation">
        <button
          className={activeTab === "sunKing" ? "active" : ""}
          onClick={() => handleTabClick("sunKing")}
        >
          Edit Sun King
        </button>

        <button
          className={activeTab === "actors" ? "active" : ""}
          onClick={() => handleTabClick("actors")}
        >
          Actors List
        </button>

        <button
          className={activeTab === "votingStandings" ? "active" : ""}
          onClick={() => handleTabClick("votingStandings")}
        >
          Voting Standings in Groups
        </button>
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => handleTabClick("users")}
        >
          Users
        </button>
      </div>

      <div className="admin-cards-container">
        {activeTab === "actors" && <AdminActorsList URL={URL} API_KEY={API_KEY} />}
        {activeTab === "sunKing" && <AdminSunKingEdit URL={URL} API_KEY={API_KEY} />}
        {activeTab === "votingStandings" && (
          <AdminVotingStandings />
          
        )}
        {activeTab === "users" && <AdminUsersList URL={URL} API_KEY={API_KEY} />}
      </div>
    </div>
  );
}

export default AdminPage;
