import React from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import './PaymentButton.scss';

function PaymentButton({ text, amount, priceId }) {
  const stripe = useStripe();

  const handlePayment = async () => {

     // Ensure Stripe is loaded
  if (!stripe) {
    console.error("Stripe has not been properly initialized.");
    return;
  }

    const result = await stripe.redirectToCheckout({
      lineItems: [{
        price: priceId, 
        quantity: 1
      }],
      mode: "payment",
      successUrl: "http://localhost:3000/success",
      cancelUrl: "http://localhost:3000/cancel",
    });

    if (result.error) {
      console.error(result.error.message);
    }
  };

  return (
    <button onClick={handlePayment}>
      {text} {amount}
    </button>
  );
}

export default PaymentButton;