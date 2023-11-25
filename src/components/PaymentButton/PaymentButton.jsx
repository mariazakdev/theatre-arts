import React, { useState } from 'react';
import { useStripe } from "@stripe/react-stripe-js";

import "./PaymentButton.scss";

function PaymentButton({ amount, priceId, onPaymentSuccess, successUrl, actorId }) {
  const stripe = useStripe();
  const [voted, setVoted] = useState(false);

  const handlePayment = async () => {
    if (!stripe) {
      console.error("Stripe has not been properly initialized.");
      return;
    }

    const result = await stripe.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: "payment",
      successUrl: `http://localhost:3000/payment-success?actorId=${actorId}&votes=${amount}`,
      cancelUrl: "http://localhost:3000/cancel",
    });

    if (result.error) {
      console.error(result.error.message);
    }
    // Removed the updateVotes call here
  };

  return (
    <button className="payment-button" onClick={handlePayment} disabled={voted}>
      Contribute ${amount}
    </button>
  );
}

export default PaymentButton;
