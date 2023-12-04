import React from "react";
import PaymentButton from "../PaymentButton/PaymentButton";
import "./VotingButtons.scss";

export default function VotingButtons({
  email,
  stripeToken,
  actorId,
  currentUser
}) {


  const paymentOptions = [
    { amount: 10, priceId: process.env.REACT_APP_ITEM1_PRICE_ID },
    { amount: 25, priceId: process.env.REACT_APP_ITEM2_PRICE_ID },
    { amount: 50, priceId: process.env.REACT_APP_ITEM3_PRICE_ID },
    { amount: 100, priceId: process.env.REACT_APP_ITEM4_PRICE_ID },
    { amount: 250, priceId: process.env.REACT_APP_ITEM5_PRICE_ID },
  ];

  return (
    <div className="button-wrap">
      <h2>Help this actor achieve their dream faster by contributing</h2>
      <h3>Funds go to charity</h3>

      <div className="button-wrap__button-container">
        {paymentOptions.map(({ amount, priceId }) => (
          <PaymentButton
            key={amount} 
            text="Contribute $"
            amount={amount}
            priceId={priceId}
            email={email}
            stripeToken={stripeToken}
            actorId={actorId}
            currentUser={currentUser}
          />
        ))}
      </div>
    </div>
  );
}