import React from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import './PaymentButton.scss';

function PaymentButton({ text, amount, priceId ,onPaymentSuccess, successUrl }) {
  const stripe = useStripe();


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
      if (onPaymentSuccess) {
        onPaymentSuccess(amount); 
      }
    }
  };

  return (

    <button className="payment-button" onClick={handlePayment}>
      Contribute ${amount}
     
    </button>
  );
}

export default PaymentButton;