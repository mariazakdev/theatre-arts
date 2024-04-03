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

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists() && userDoc.data().hasPaid) {
          // User has already paid, redirect them to the upload page
          navigate("/contestant/upload");
        }
      }
    };

    checkPaymentStatus();
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

    console.log("Confirming PaymentIntent...");
    console.log("Before navigating to upload");

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
        console.log("PaymentIntent confirmed:", paymentIntent.id);

        // Update user's payment status in Firebase
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          await updateDoc(userDocRef, {
            hasPaid: true,
          });
        } else {
          await setDoc(userDocRef, {
            hasPaid: true,
          });
        }
        await axios.post(
          `${URL}/users/updateHasPaid/${currentUser.uid}`,
          { headers: { Authorization: `${API_KEY}` } }
        );
        console.log(currentUser.uid);
        // Redirect to the upload page
        navigate("/contestant/upload");
        console.log("After navigating to upload");
      } else {
        console.log("PaymentIntent status:", paymentIntent.status);
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
