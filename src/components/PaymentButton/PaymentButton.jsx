import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useStripe } from "@stripe/react-stripe-js";
import { useAuth } from "../../contexts/AuthContext";
import "./PaymentButton.scss";

function PaymentButton({ CLIENT_URL, text, amount, priceId, actorId, currentUser }) {
  const stripe = useStripe();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [voted, setVoted] = useState(false);

  const handlePayment = async ({onLoginAndNavigate}) => {
    console.log("Payment button clicked! paymentbutton");

    if (!stripe) {
      console.error("Stripe has not been properly initialized.");
      return;
    }
    if (!currentUser) {
      onLoginAndNavigate(); 
      return;
    }
    console.log("Before payment request", amount); 

    setVoted(true);

    const result = await stripe.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: "payment",
      successUrl: `${CLIENT_URL}/payment-success?actorId=${actorId}&votes=${amount}`,
      cancelUrl: `${CLIENT_URL}/cancel`,
    });

    if (result.error) {
      console.error(result.error.message);
      setVoted(false);
    }
    console.log("After payment request", amount);
  };

  return (
    <button className="payment-button" onClick={handlePayment} disabled={voted}>
      { text }{ amount }
    </button>
  );
}

export default PaymentButton;
