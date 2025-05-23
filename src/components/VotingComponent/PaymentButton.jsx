import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useStripe } from "@stripe/react-stripe-js";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import "./PaymentButton.scss";
import PaymentSuccess from "../PaymentSuccess/PaymentSuccess";

const CLIENT_URL = process.env.REACT_APP_URL;

function PaymentButton({
  URL,
  text,
  amount,
  priceId,
  actorId,
  currentUser,
  onLoginAndNavigate,
  setErrorMessage,
  API_KEY,
}) {
  const stripe = useStripe();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [voted, setVoted] = useState(false);

  const processStripePayment = async () => {
    try {
      const result = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: "payment",
        successUrl: `${CLIENT_URL}/vote-payment?actorId=${actorId}&votes=${amount}`,
        cancelUrl: `${CLIENT_URL}/cancel`,
      });
    
      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error("Error during payment processing:", error);
      setVoted(false);
    }
  };

  const handlePayment = async () => {
    try {
        let userIdData;
        let userEmail;
        let userData;
        let voterEmail;
        let actorName;

        if (!stripe) {
            console.error("Stripe has not been properly initialized.");
            setErrorMessage("Stripe is not available. Please try again.");
            return;
           
        }

        if (!currentUser) {
            onLoginAndNavigate();
            return;
        }
        if (!currentUser.uid) {
          console.warn("currentUser is present, but UID is missing. Possibly a delayed login.");
          setErrorMessage("We’re having trouble verifying your account. Please try refreshing or logging in again.");
          onLoginAndNavigate();
          return;
        }
    
        // Optional: Check if email is verified
        if (!currentUser.emailVerified) {
          console.warn("User has not verified their email:", currentUser.email);
          setErrorMessage("Please verify your email before voting.");
          return;
        }
        // Fetch user data
        const userResponse = await axios.get(`${URL}/users/${currentUser.uid}`, {
            headers: { Authorization: `${API_KEY}` },
        });

        if (!userResponse.data || !userResponse.data.user) {
            setErrorMessage("User data not found.");
            return;
        }

        userData = userResponse.data;
        actorName = userData.contestant?.name || "Your selected contestant";
        userIdData = userData.user.id;
        userEmail = userData.user.email;


if (!userIdData) {
  setErrorMessage("User ID missing. Please try again or contact support.");
  console.error("Missing user ID:", userData.user);
  return;
}

        if (!userEmail || !actorName) {
            console.error("Invalid email data:", { voterEmail, actorName });
            return;
        }

        // Prepare vote data
        const votesData = {
            userId: userIdData,
       
        };

        // Check vote eligibility
        const response = await axios.post(
            `${URL}/votes-extra/check-vote-eligibility`,
            votesData,
            { headers: { Authorization: `${API_KEY}` } }
        );

        // if (response.status === 200) {
        //   setErrorMessage("You may vote, but eligibility will be verified after payment.");
        // }

        // // If eligible, proceed with Stripe payment
        // setVoted(true);
        // await processStripePayment();
        if (response.status === 200) {
          // User is eligible — continue
          setVoted(true);
          await processStripePayment();
        } else {
          // Just in case — block voting
          setErrorMessage("You are not eligible to vote at this time.");
        }

    // } catch (error) {
    //     console.error("Error during payment processing:", error);

    //     if (error.response && error.response.status === 400) {
    //         setErrorMessage(error.response.data.message);
    //     }

    //     setVoted(false);
    // }
  } catch (error) {
    console.error("Error during payment processing:", error);
    if (error.response && error.response.status === 400) {
      setErrorMessage(error.response.data.message);
    } else {
      setErrorMessage("An error occurred. Please try again.");
    }
    setVoted(false);
  }
};


  return (
    <>
      <button
        className="payment-button"
        onClick={handlePayment}
        disabled={voted}
      >
        {text} {amount}
      </button>
      <PaymentSuccess
        URL={URL}
        API_KEY={API_KEY}
        setErrorMessage={setErrorMessage}
      />
    </>
  );
}

export default PaymentButton;