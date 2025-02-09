
// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useStripe } from "@stripe/react-stripe-js";
// import { useAuth } from "../../contexts/AuthContext";
// import axios from "axios";
// import "./PaymentButton.scss";
// import PaymentSuccess from "../PaymentSuccess/PaymentSuccess";

// function PaymentButton({
//   CLIENT_URL,
//   URL,
//   text,
//   amount,
//   priceId,
//   actorId,
//   currentUser,
//   onLoginAndNavigate,
//   setErrorMessage,
//   API_KEY
// }) {
//   const stripe = useStripe();
//   const { user } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [voted, setVoted] = useState(false);
//   let userData;
//   let userIdData;

//   // Function to handle Stripe payment processing
//   const processStripePayment = async () => {
//     try {
//       const result = await stripe.redirectToCheckout({
//         lineItems: [{ price: priceId, quantity: 1 }],
//         mode: "payment",
//         successUrl: `${CLIENT_URL}/vote-payment?actorId=${actorId}&votes=${amount}`,
//         cancelUrl: `${CLIENT_URL}/cancel`,
//       });

//       if (result.error) {
//         throw new Error(result.error.message);
//       }
//     } catch (error) {
//       console.error("Error during payment processing:", error);

//       if (error.message.includes("400")) {
//         console.error("Payment failed with a 400 error:", error.message);
//       }

//       setVoted(false);
//     }
//   };

//   const handlePayment = async () => {
  
//     try {
//       if (!stripe) {
//         console.error("Stripe has not been properly initialized.");
//         return;
//       }
  
//    if (!currentUser) {
//         // Log in to vote
//         onLoginAndNavigate();
//         return;
//       }
    
//       const votesResponse = await axios.post(`${URL}/votes-extra`, votesData,
//         { headers: 
//           { Authorization: `${API_KEY}` } 
//       }
      
//         );
//         if (votesResponse.status === 201) {
//         }

//         const votesTrackerResponse = await axios.post(`${URL}/votes-tracker`, votesTrackerData,
//         { headers: 
//           { Authorization: `${API_KEY}` } 
//         }
//       );

//       if (votesTrackerResponse.status === 201) {
//       }
//       setVoted(true);
  
//       await processStripePayment();
//       } catch (error) {
//       console.error("Error during payment processing:", error);
//       if (error.response && error.response.status === 400) {
//         setErrorMessage(error.response.data.message);
//       }

  
//       setVoted(false);
//     }
//   };

//   return (
//     <>
//     <button 
// // // Button fully disabled until further notice
// // disabled={true}
// // className="disabled-button payment-button"


//     className="payment-button" 
//     onClick={handlePayment} 
//     disabled={voted}
    
//     >
//       {text}
//       {amount}
//     </button>
//     <PaymentSuccess setErrorMessage={setErrorMessage}/>
//     </>
//   );
// }

// export default PaymentButton;

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
        let actorId;

        if (!stripe) {
            console.error("Stripe has not been properly initialized.");
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
        actorId = userData.contestant?.id;
        userIdData = userData.user.id;
        userEmail = userData.user.email;

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

        if (response.status !== 200) {
            setErrorMessage("You are not eligible to vote at this time.");
            return;
        }

        // If eligible, proceed with Stripe payment
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