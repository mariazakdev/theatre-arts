import React, { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "./PaymentForm.scss";

const PaymentForm = ({ URL, CLIENT_URL, API_KEY }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [cardholderName, setCardholderName] = useState("");

  // If didn't pay, redirect to payment page, if paid, redirect to home
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${URL}/users/${currentUser.uid}`, {
          headers: { Authorization: `${API_KEY}` },
        });
        const user = response.data.user;
        if (user.hasPaid === 1 && user.uploadStatus === 1) {
          navigate("/contestant/dashboard");
        } else if (user.hasPaid === 0 && user.uploadStatus === 0  ) { 
          navigate("/contestant/enter");
        }
        
        else if (user.hasPaid === 1 && user.uploadStatus === 0) {
          navigate("/contestant/upload");
        }

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (currentUser) {
      fetchUserData();
    } else {
      navigate("/login");
    }
  }, [currentUser, navigate]);


  const handlePayment = async () => {
    if (!stripe || !elements) {
      console.error("Stripe or Elements not loaded");
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);

    if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
      console.error("Some card elements are not loaded correctly");
      return;
    }

    try {
      // Create a PaymentMethod using card information
      const { paymentMethod, error: pmError } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardNumberElement,
        });

      if (pmError) {
        console.error("Error creating PaymentMethod:", pmError.message);
        return;
      }

      // Check user's payment status
      const userResponse = await axios.get(`${URL}/users/${currentUser.uid}`,
      
      { headers: { Authorization: `${API_KEY}` }},

      );
      const { hasPaid } = userResponse.data;

      if (hasPaid) {
        navigate("/contestant/upload");
        return;
      }

      // Fetch the PaymentIntent client secret from your server
      const response = await axios.post(
        `${URL}/payment`,
        {
          amount: 250,
          currency: "cad",
          paymentMethodId: paymentMethod.id,
        },
        { headers: { Authorization: `${API_KEY}` } }
      );

      const clientSecret = response.data.clientSecret;
      // Confirm the PaymentIntent on the client side
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: paymentMethod.id,
          return_url: `${CLIENT_URL}/contestant/payment-success`,
        }
      );

      if (error) {
        console.error("Error confirming PaymentIntent:", error.message);
      } else if (paymentIntent.status === "succeeded") {

        // Update user's payment status in your backend
        try {
          await axios.put(`${URL}/users/updateHasPaid/${currentUser.uid}`, {
            hasPaid: 1,
          },

                { headers: { Authorization: `${API_KEY}` }},

          
          );
        } catch (updateError) {
          console.error("Error updating user's hasPaid:", updateError.message);
        }

        navigate("/contestant/upload");
      }
    } catch (error) {
      console.error("Error during PaymentIntent confirmation:", error.message);
      console.error("Full error object:", error);
    }
  };

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
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
          />
        </label>
        <label>
          Card number
          <CardNumberElement />
        </label>
        <label>
          Expiration date
          <CardExpiryElement />
        </label>
        <label>
          CVC
          <CardCvcElement />
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
};

export default PaymentForm;
