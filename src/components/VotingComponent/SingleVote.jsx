import React, { useState } from 'react';
import PaymentButton from '../PaymentButton/PaymentButton';

export default function SingleVote() {
  const [voted, setVoted] = useState(false);

  const handleVoteClick = () => {
    // You can implement your logic to send a vote to the backend here
    // For now, let's just toggle the voted state as a placeholder
    setVoted(!voted);
  };

  return (
    <div>
      <h2>Your Vote</h2>
      <p>{voted ? 'You have voted!' : 'Click the button to vote'}</p>
      <PaymentButton amount={"Free Vote"}onClick={handleVoteClick} disabled={voted}/>
      
    </div>
  );
}
