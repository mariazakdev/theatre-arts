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

        // Fetch user data
        const userResponse = await axios.get(`${URL}/users/${currentUser.uid}`, {
            headers: { Authorization: `${API_KEY}` },
        });

        if (!userResponse.data || !userResponse.data.user) {
            setErrorMessage("User data not found.");
            return;
        }

        userData = userResponse.data;
        voterEmail = userData?.user?.email;
        actorName = userData.contestant?.name || "Your selected contestant";
        userIdData = userData.user.id;
        userEmail = userData.user.email;


if (!userIdData) {
  setErrorMessage("User ID missing. Please try again or contact support.");
  console.error("Missing user ID:", userData.user);
  return;
}

        if (!voterEmail || !actorName) {
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