import React from 'react';
import PaymentButton from '../PaymentButton/PaymentButton';

function ExtraVotes({CLIENT_URL} ) {
  const handlePaymentSuccess = (details, data) => {
    console.log("Payment Successful!", details, data);
  }

  return (
    <div>
      <h2>More Votes Options</h2>
      <p>10 votes for $10</p>
      <PaymentButton amount="10.00" onSuccess={handlePaymentSuccess} CLIENT_URL={CLIENT_URL}  />
      <p>10 votes for $10</p>
      <PaymentButton amount="20.00" onSuccess={handlePaymentSuccess} CLIENT_URL={CLIENT_URL}/>
      <p>10 votes for $10</p>
      <PaymentButton amount="50.00" onSuccess={handlePaymentSuccess} CLIENT_URL={CLIENT_URL}/>
      <p>10 votes for $10</p>
      <PaymentButton amount="100.00" onSuccess={handlePaymentSuccess} CLIENT_URL={CLIENT_URL}/>

    </div>
  );
}

export default ExtraVotes;