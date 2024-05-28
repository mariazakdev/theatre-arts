import React from 'react'
import "./DashBoardVoterComponent.scss";

function DashBoardVoterComponent({ votes}) {


  return (
    <div>
            <div className="dashboard-voters">
            <h3>Supporters</h3>
            {votes.length > 0 ? (
              votes.map((vote) => (
                <div key={vote.id} className="dashboard-voters__info">
                  <p>Email: {vote.email}</p>
                  <p>Votes: {vote.votes_count}</p>
                </div>
              ))
            ) : (
              <p>No supporters yet.</p>
            )}
          </div>
    </div>
  )
}

export default DashBoardVoterComponent
