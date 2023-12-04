import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useStripe } from "@stripe/react-stripe-js";
import { useAuth } from "../../contexts/AuthContext";
import "./PaymentButton.scss";

function PaymentButton({ text, amount, priceId, actorId, currentUser }) {
  const stripe = useStripe();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [voted, setVoted] = useState(false);

  const handlePayment = async () => {
    console.log("Payment button clicked! paymentbutton");

    if (!stripe) {
      console.error("Stripe has not been properly initialized.");
      return;
    }
    if (!currentUser ) {
      navigate("/login", { state: { returnPath: location.pathname } });
      return;
    }
    console.log("Before payment request", amount); 

    setVoted(true);

    const result = await stripe.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: "payment",
      successUrl: `http://localhost:3000/payment-success?actorId=${actorId}&votes=${amount}`,
      cancelUrl: "http://localhost:3000/cancel",
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
