import React, { useState } from 'react';
import { auth } from '../../firebase';
import { currentUser } from 'firebase/auth';
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";

import "../../styles/forms.scss";

function UploadForm({backendURL}) {

    const stripe = useStripe();
    const elements = useElements();

    const [formData, setFormData] = useState({
        photoUrl: '', // Keeping this, will be null for now.
        videoUrl: '',
        description: '',
        name: ''
    });

    const [hasPaid, setHasPaid] = useState(false);

    const CARD_STYLES = {
        style: {
            base: {
                color: "#32325d",
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#aab7c4"
                }
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a"
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = auth.currentUser;
            if (user) {
                formData.firebaseId = user.uid;
                const response = await fetch(`${backendURL}/upload`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                const result = await response.json();
                console.log(result);
            } else {
                console.log("User not logged in");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    // payments
    const handlePayment = async () => {
        console.log("handlePayment triggered");
    
        if (!stripe || !elements) {
            console.error("Stripe or Elements not loaded");
            return;
        }
    
        // Get individual card elements
        const cardNumberElement = elements.getElement(CardNumberElement);
        const cardExpiryElement = elements.getElement(CardExpiryElement);
        const cardCvcElement = elements.getElement(CardCvcElement);
    
        if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
            console.error("Some card elements are not loaded correctly");
            return;
        }
    
        console.log("Creating token...");
    
        // Use the `createToken` function
        const result = await stripe.createToken(cardNumberElement);
    
        if (result.error) {
            console.error("Error creating token:", result.error.message);
        } else {
            console.log("Token created:", result.token);
    
            // Send token to your server to handle the actual payment process
            const user = auth.currentUser;
            if (user && user.email) {  // Ensure user and their email exists
                const paymentResponse = await fetch(`${backendURL}/payment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        stripeToken: result.token.id,
                        email: user.email
                    })
                });
    
                const paymentResult = await paymentResponse.json();
                if (paymentResult.success) {
                    setHasPaid(true);
                } else {
                    console.error("Error during payment:", paymentResult.error);
                    // might add alert here later
                }
            } else {
                console.error("User not logged in or email not available");
            }
        }
    }

    return (
        <div className="form-container">
            <h2 className="form-container__title">Upload to Enter Contest</h2>
            {!hasPaid ? (
                <div className="form-container__payment-info">
                    <h3 className="form-container__instruction">Please pay to participate in the contest</h3>
                    <label>
                Name on Card
                <input 
                    className="form-container__input form-container__input--text"
                    type="text" 
                    placeholder="Name" 
                    // Add an onChange handler and value binding if you want to manage this state
                />
            </label>
                    <label>
                        Card number
                        <CardNumberElement options={CARD_STYLES} />
                    </label>
                    <label>
                        Expiration date
                        <CardExpiryElement options={CARD_STYLES} />
                    </label>
                    <label>
                        CVC
                        <CardCvcElement options={CARD_STYLES} />
                    </label>
                    <button className="form-container__pay-button" onClick={handlePayment}>Pay To Enter and Upload</button>
                </div>
            ) : (
                <form className="form-container__form" onSubmit={handleSubmit}>

<div className="input-group">

                    <input
                        className="form-container__input form-container__input--text"
                        type="text"
                        name="videoUrl"
                        placeholder="Video URL"
                        value={formData.videoUrl}
                        onChange={handleInputChange}
                    />
                    </div>

                    <div className="input-group">

                    <input
                        className="form-container__input form-container__input--text"
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                    </div>
                    <div className="input-group">

                    <input
                        className="form-container__input form-container__input--text"
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    </div>
                    <button className="form-container__submit-button" type="submit">Submit</button>
                </form>
            )}
        </div>
    );
}

export default UploadForm;
