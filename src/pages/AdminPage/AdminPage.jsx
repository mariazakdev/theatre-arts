import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext"; 
import { useNavigate } from "react-router-dom";
import ContestantStanding from "../../components/ContestantStanding/ContestantStanding";
import AdminActorsList from "../../components/AdminComponents/AdminActorsList";
import AdminSunKingEdit from "../../components/AdminComponents/AdminSunKingEdit";
import AdminVotingStandings from "../../components/AdminComponents/AdminVotingStandings";
import AdminGroupsCounter from "../../components/AdminComponents/AdminGroupsCounter";
import ContestantAnnouncement from "../../components/ContestantStanding/ContestantAnnouncements";
import "./AdminPage.scss";

function AdminPage({ URL, API_KEY}) {
  const [activeTab, setActiveTab] = useState("actors");
  const [showVotingStandings, setShowVotingStandings] = useState(false);
const { currentUser } = useAuth();
const navigate = useNavigate();

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
        console.log(response.data.user); 
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
    if (tab === "votingStandings") {
      setShowVotingStandings(true);
    } else {
      setShowVotingStandings(false);
    }
  };

  return (
    <div className="admin-list-container">
      <h1>Users and their Videos</h1>
       <AdminGroupsCounter URL={URL} API_KEY={API_KEY}/> 
       <ContestantAnnouncement URL={URL} API_KEY={API_KEY}/>
      <ContestantStanding URL={URL} API_KEY={API_KEY} />
      <div className="admin-navigation">
        <button
          className={activeTab === "actors" ? "active" : ""}
          onClick={() => handleTabClick("actors")}
        >
          Actors
        </button>
        <button
          className={activeTab === "sunKing" ? "active" : ""}
          onClick={() => handleTabClick("sunKing")}
        >
          Sun King
        </button>
        <button
          className={activeTab === "votingStandings" ? "active" : ""}
          onClick={() => handleTabClick("votingStandings")}
        >
          Voting Standings
        </button>
      </div>

      <div className="admin-cards-container">
        {activeTab === "actors" && <AdminActorsList URL={URL} API_KEY={API_KEY}/>}
        {activeTab === "sunKing" && <AdminSunKingEdit URL={URL} API_KEY={API_KEY}/>}
        {showVotingStandings && <AdminVotingStandings URL={URL} API_KEY={API_KEY}/>}
      </div>
    </div>
  );
}

export default AdminPage;
