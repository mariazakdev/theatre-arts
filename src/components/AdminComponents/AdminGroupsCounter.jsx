// MainComponent.js
import React, { useState } from 'react';
import ContestantStanding from '../ContestantStanding/ContestantStanding';

const AdminGroupsCounter = ({URL , API_KEY}) => {
  const [timerStarted, setTimerStarted] = useState(false);

  const startTimer = () => {
    setTimerStarted(true);
  };

  return (
    <div>
      {timerStarted && <ContestantStanding URL={URL} API_KEY={API_KEY}/>}
    </div>
  );
};

export default AdminGroupsCounter;
