// MainComponent.js
import React, { useState } from 'react';
import ContestantStanding from '../ContestantStanding/ContestantStanding';
import TimerStartButton from '../ContestantStanding/ContestantCountDownButton';

const AdminGroupsCounter = ({URL}) => {
  const [timerStarted, setTimerStarted] = useState(false);

  const startTimer = () => {
    setTimerStarted(true);
  };

  return (
    <div>
      <TimerStartButton startTimer={startTimer} />
      {timerStarted && <ContestantStanding URL={URL} />}
    </div>
  );
};

export default AdminGroupsCounter;
