import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PaymentButton from "../PaymentButton/PaymentButton";
import { useAuth } from "../../contexts/AuthContext";
import "./VotingButtons.scss";

// Voting buttons options
// Stripe payment processing inside the PaymentButton component
// Login and navigate to the login page if not logged in (flash message)
// Prices set here

export default function VotingButtons({
  CLIENT_URL,
  URL,
  email,
  stripeToken,
  actorId,
  currentUser,
  setErrorMessage,
errorMessage,
  API_KEY
}) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [flashMessage, setFlashMessage] = useState("");

  // If not logged in, see flash message and navigate to the login page
  const handleLoginAndNavigate = () => {
    setFlashMessage("Log in to contribute");
    setTimeout(() => {
      navigate("/login", { state: { returnPath: location.pathname, actorId } });
    }, 4000);
  };
  
  // Payment options
  const paymentOptions = [
    { amount: 10, priceId: process.env.REACT_APP_ITEM1_PRICE_ID },
    { amount: 25, priceId: process.env.REACT_APP_ITEM2_PRICE_ID },
    { amount: 50, priceId: process.env.REACT_APP_ITEM3_PRICE_ID },
    { amount: 100, priceId: process.env.REACT_APP_ITEM4_PRICE_ID },
    { amount: 250, priceId: process.env.REACT_APP_ITEM5_PRICE_ID },
  ];


  return (
    <div className="button-wrap">
      {flashMessage && <p className="flash-message">{flashMessage}</p>}

      <h2>Help this actor achieve their dream faster by contributing</h2>
      <h3>Funds go to charity</h3>

      <div className="button-wrap__button-container">
        {paymentOptions.map(({ amount, priceId }) => (
          <PaymentButton
            CLIENT_URL={CLIENT_URL}
            URL={URL}
            key={amount}
            text="Contribute $"
            amount={amount}
            priceId={priceId}
            email={email}
            stripeToken={stripeToken}
            actorId={actorId}
            currentUser={currentUser}
            onLoginAndNavigate={handleLoginAndNavigate}
            API_KEY={API_KEY}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        ))}
      </div>
    </div>
  );
}
