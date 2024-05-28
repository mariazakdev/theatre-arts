
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useStripe } from "@stripe/react-stripe-js";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import "./PaymentButton.scss";
import PaymentSuccess from "../PaymentSuccess/PaymentSuccess";

function PaymentButton({
  CLIENT_URL,
  URL,
  text,
  amount,
  priceId,
  actorId,
  currentUser,
  onLoginAndNavigate,
  setErrorMessage,
  API_KEY
}) {
  const stripe = useStripe();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [voted, setVoted] = useState(false);
  let userData;
  let userIdData;

  // Function to handle Stripe payment processing
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

      if (error.message.includes("400")) {
        console.error("Payment failed with a 400 error:", error.message);
      }

      setVoted(false);
    }
  };

  const handlePayment = async () => {
    console.log("Payment button clicked! paymentbutton");
  
    try {
      if (!stripe) {
        console.error("Stripe has not been properly initialized.");
        return;
      }
  
      if (!currentUser) {
        // Log in to vote
        onLoginAndNavigate();
        return;
      }
  
      if (currentUser) {
        // Retrieve user data
        const userResponse = await axios.get(
          `${URL}/users/${currentUser.uid}`,
          {
            headers: { Authorization: `${API_KEY}` },
          }
        );
        userData = userResponse.data;
        if (userData.user) {
          userIdData = userData.user.id;
        }
        console.log("userData:", userData);
      }
  
      // Use the user's id in the votesData
      const votesData = {
        userId: userIdData,
        contestantId: actorId,
        numberOfVotes: 1,
      };
    const votesTrackerData = {
      userId: userIdData,
      email: userData.user.email,
      contestantId: actorId,
      numberOfVotes:amount,
      round: 1
    };
    
      const votesResponse = await axios.post(`${URL}/votes-extra`, votesData,
        { headers: 
          { Authorization: `${API_KEY}` } 
      }
      
        );
        if (votesResponse.status === 201) {
        }

        const votesTrackerResponse = await axios.post(`${URL}/votes-tracker`, votesTrackerData,
        { headers: 
          { Authorization: `${API_KEY}` } 
        }
      );

      if (votesTrackerResponse.status === 201) {
      }
      setVoted(true);
  
      await processStripePayment();
      } catch (error) {
      console.error("Error during payment processing:", error);
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      }

  
      setVoted(false);
    }
  };

  return (
    <>
    <button className="payment-button" onClick={handlePayment} disabled={voted}>
      {text}
      {amount}
    </button>
    <PaymentSuccess setErrorMessage={setErrorMessage}/>
    </>
  );
}

export default PaymentButton;