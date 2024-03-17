import React, { useState, useEffect } from "react";
import ContestantStanding from "../../components/ContestantStanding/ContestantStanding";
import AdminActorsList from "../../components/AdminComponents/AdminActorsList";
import AdminSunKingEdit from "../../components/AdminComponents/AdminSunKingEdit";
import AdminVotingStandings from "../../components/AdminComponents/AdminVotingStandings";
import AdminGroupsCounter from "../../components/AdminComponents/AdminGroupsCounter";
import "./AdminPage.scss";
import ContestantAnnouncement from "../../components/ContestantStanding/ContestantAnnouncements";

// const URL = process.env.REACT_APP_BACKEND_URL;

function AdminPage({ URL}) {
  const [activeTab, setActiveTab] = useState("actors");
  const [showVotingStandings, setShowVotingStandings] = useState(false);

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
       <AdminGroupsCounter URL={URL} /> 
       <ContestantAnnouncement />
      <ContestantStanding URL={URL} />
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
        {activeTab === "actors" && <AdminActorsList URL={URL} />}
        {activeTab === "sunKing" && <AdminSunKingEdit URL={URL} />}
        {showVotingStandings && <AdminVotingStandings />}
      </div>
    </div>
  );
}

export default AdminPage;
