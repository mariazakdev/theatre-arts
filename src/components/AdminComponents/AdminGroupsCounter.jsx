// MainComponent.js
import React, { useState } from 'react';
import ContestantStanding from '../ContestantStanding/ContestantStanding';

const AdminGroupsCounter = ({URL}) => {
  const [timerStarted, setTimerStarted] = useState(false);

  const startTimer = () => {
    setTimerStarted(true);
  };

  return (
    <div>
      {timerStarted && <ContestantStanding URL={URL} />}
    </div>
  );
};

export default AdminGroupsCounter;
