import React, { useState } from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import { useNavigate } from 'react-router-dom';
import "../../styles/forms.scss";

const CARD_OPTIONS = {
    style: {
        base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
                color: '#aab7c4',
            },
        },
        invalid: {
            color: '#9e2146',
        },
    },
};

function PaymentForm({ backendURL }) {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);  // State to handle errors

    const handlePayment = async () => {
        if (!stripe || !elements) {
            console.error("Stripe has not loaded");
            return;
        }

        const cardElement = elements.getElement(CardNumberElement);
        const tokenResponse = await stripe.createToken(cardElement);

        if (tokenResponse.error) {
            setError(tokenResponse.error.message);  // Set error state
            return;
        }

        const response = await fetch(`${backendURL}/payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stripeToken: tokenResponse.token.id, email }),
        });

        if (response.ok) {
            navigate("/contestant/upload");  // Redirect to upload page after successful payment
        } else {
            setError("Payment failed");  // Update error state on payment failure
        }
    };

    return (
        <div className="payment-form">
            <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email for receipt" 
            />
            <CardNumberElement options={CARD_OPTIONS} />
            <CardExpiryElement options={CARD_OPTIONS} />
            <CardCvcElement options={CARD_OPTIONS} />
            <button onClick={handlePayment}>Pay and Continue</button>
            {error && <div className="error-message">{error}</div>}  {/* Display errors if any */}
        </div>
    );
}

export default PaymentForm;
