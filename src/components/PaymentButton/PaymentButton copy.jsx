import React from "react";
import { useStripe } from "@stripe/react-stripe-js";
import axios from "axios";

import "./PaymentButton.scss";

function PaymentButton({ amount, priceId, onPaymentSuccess, successUrl, actorId }) {
  const stripe = useStripe();

  const updateVotes = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/upload/vote/${actorId}`,
        { votes: amount }
      );
      console.log(amount);

      if (response.status === 200) {
        console.log("Votes recorded:", response.data);
        if (onPaymentSuccess) {
          onPaymentSuccess(amount);
        }
      }
    } catch (error) {
      console.error("Error while voting:", error);
    }
  };

  const handlePayment = async () => {
    if (!stripe) {
      console.error("Stripe has not been properly initialized.");
      return;
    }

    const result = await stripe.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: "payment",
      successUrl: successUrl,
      cancelUrl: "http://localhost:3000/cancel",
    });

    if (result.error) {
      console.error(result.error.message);
    } else {
      await updateVotes(); // Update votes after successful payment
    }
  };

  return (
    <button className="payment-button" onClick={handlePayment}>
      Contribute ${amount}
    </button>
  );
}

export default PaymentButton;