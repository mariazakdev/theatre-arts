// MainComponent.js
import React, { useState } from 'react';
import ContestantGroupsRestart from '../ContestantStanding/ContestantGroupsRestart';

const AdminGroupsCounter = ({URL , API_KEY}) => {
  const [timerStarted, setTimerStarted] = useState(false);

  const startTimer = () => {
    setTimerStarted(true);
  };

  return (
    <div>
      {timerStarted && <ContestantGroupsRestart URL={URL} API_KEY={API_KEY}/>}
    </div>
  );
};

export default AdminGroupsCounter;
