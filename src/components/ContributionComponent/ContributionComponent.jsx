import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import './ContributionComponent.scss';

function ContributionComponent({CLIENT_URL}) {
    const stripe = useStripe();
    const elements = useElements();

    const handlePayment = async (priceId) => {
        if (!stripe || !elements) {
            console.error("Stripe or Elements not loaded");
            return;
        }

        const card = elements.getElement(CardElement);

        if (!card) {
            console.error("Error finding card element");
            return;
        }

        const result = await stripe.redirectToCheckout({
            lineItems: [{
                price: priceId,
                quantity: 1
            }],
            mode: "payment",
            successUrl: `${CLIENT_URL}/success`,
            cancelUrl: `${CLIENT_URL}/cancel`,
        });

        if (result.error) {
            console.error(result.error.message);
        }
    };

    return (
        <div className='contribution-wrap'>
            <div className='contribution-wrap__card-section'>
                <CardElement />
                <button onClick={() => handlePayment(/* You can specify a default priceId or get it dynamically */)}>Pay</button>
            </div>
        </div>
    );
}

export default ContributionComponent;
