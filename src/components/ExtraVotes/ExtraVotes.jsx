import React from 'react';
import PaymentButton from '../PaymentButton/PaymentButton';

function ExtraVotes() {
  const handlePaymentSuccess = (details, data) => {
    console.log("Payment Successful!", details, data);
    // Here, you might want to update the user's vote count in your database.
  }

  return (
    <div>
      <h2>More Votes Options</h2>
      <p>10 votes for $10</p>
      <PaymentButton amount="10.00" onSuccess={handlePaymentSuccess} />
      <p>10 votes for $10</p>
      <PaymentButton amount="20.00" onSuccess={handlePaymentSuccess} />
      <p>10 votes for $10</p>
      <PaymentButton amount="50.00" onSuccess={handlePaymentSuccess} />
      <p>10 votes for $10</p>
      <PaymentButton amount="100.00" onSuccess={handlePaymentSuccess} />

    </div>
  );
}

export default ExtraVotes;