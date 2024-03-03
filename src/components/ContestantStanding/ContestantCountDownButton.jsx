import React from 'react';

const ContestantCountDownButton = ({ startTimer }) => {
  return (
    <button onClick={startTimer}>
      Start Groups Timer
    </button>
  );
};

export default ContestantCountDownButton;