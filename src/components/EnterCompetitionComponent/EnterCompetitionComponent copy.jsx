import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import "../../styles/forms.scss";

const BUCKET_NAME = process.env.REACT_APP_AWS_BUCKET_NAME;
const REGION = process.env.REACT_APP_AWS_REGION;
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  },
});

function PaymentForm({ backendURL }) {
  const { currentUser } = useAuth();

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null); // State to handle errors
  const [hasPaid, setHasPaid] = useState(false);
  const [stripeToken, setStripeToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // if (!currentUser) {
    //     alert("You need to log in.");
    //     navigate("/login");
    //     return;
    // }

    const checkPaymentStatus = async () => {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && userDoc.data().hasPaid) {
        navigate("/contestant/upload"); // Redirect if payment already made
      } else {
        setIsLoading(false);
      }
    };

    checkPaymentStatus();
  }, [currentUser, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  useEffect(() => {
    if (auth.currentUser) {
      console.log("Current user's Firebase UID:", auth.currentUser.uid);
    }
  }, []);

  const CARD_STYLES = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
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
      setError(result.error.message); // Set error state
    } else {
      console.log("Token created:", result.token);
      setStripeToken(result.token.id); // Store the token ID

      // Send token to your server to handle the actual payment process
      if (currentUser && currentUser.email) {
        const paymentResponse = await fetch(`${backendURL}/payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stripeToken: stripeToken,
            email: currentUser.email,
          }),
        });

        const paymentResult = await paymentResponse.json();
        if (paymentResult.success) {
          setHasPaid(true);
          navigate("/contestant/upload");
          console.error("Error during payment:", paymentResult.error);
          alert("Payment failed: " + paymentResult.error);
        }
      } else {
        console.error("User not logged in or email not available");
        alert("You must be logged in to make a payment.");
      }
    }
  };
  //   const handleSuccessfulPayment = async () => {
  //     // Update the user's document to mark that they've paid
  //     const userDocRef = doc(db, 'users', currentUser.uid);
  //     await updateDoc(userDocRef, {
  //         hasPaid: true
  //     });
  //     navigate('/contestant/dashboard'); // Redirect after successful payment
  // };

  return (
    <div className="form-container">
      <h2 className="form-container__title">Upload to Enter Contest</h2>

      <div className="form-container__payment-info">
        <h3 className="form-container__instruction">
          Please pay to participate in the contest
        </h3>
        <label>
          Name on Card
          <input
            className="form-container__input form-container__input--text"
            type="text"
            placeholder="Name"
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

        <button
          className="form-container__form__submit-button"
          onClick={handlePayment}
        >
          Pay To Enter and Upload
        </button>
      </div>
    </div>
  );
}

export default PaymentForm;
