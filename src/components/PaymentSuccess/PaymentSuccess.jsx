// import React, { useEffect, useState } from "react";



// import { useSearchParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext";
// import emailjs from "emailjs-com";
// import axios from "axios";

// const userThankYouId = process.env.REACT_APP_EMAILJS_USER_ID;
// const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID_THANK_YOU;
// const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID_THANK_YOU;


// function PaymentSuccess({ URL, API_KEY, setErrorMessage }) {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const { currentUser, loading } = useAuth();
//   const [processed, setProcessed] = useState(false);
//   const [flashMessage, setFlashMessage] = useState("");

//   const sendThankYouEmail = async (userEmail, actorName, numberOfVotes, actorEmail) => {
//     const emailData = {
//       voter_email: userEmail,
//       actor_name: actorName,
//       vote_count: numberOfVotes,
//       actor_email: actorEmail,
//     };

//     try {
//       await emailjs.send(serviceId, templateId, emailData, userThankYouId);
//     } catch (error) {
//       console.error("Error sending thank-you email:", error.text || error);
//     }
//   };

//   useEffect(() => {
//     const actorId = searchParams.get("actorId");
//     const votes = searchParams.get("votes");

    
//     if (!actorId || !votes) {
//       setFlashMessage("Invalid payment response. No votes recorded.");
//       return;
//     }
//     if (loading) return;

//     if (!currentUser) {
//       console.error("User not found. Authentication might be delayed.");
//       return;
//     }
//     const updateVotes = async (actorId, votes) => {
//       try {
      
//         // Send a thank-you email
//         const userResponse = await axios.get(`${URL}/users/${currentUser.uid}`, {
//           headers: { Authorization: `${API_KEY}` },
//         });
    
//         if (!userResponse.data || !userResponse.data.user) {
//           setFlashMessage("User data not found.");
//           return;
//         }

//         const userData = userResponse.data;
//         const userEmail = userData?.user?.email;
//         const actorEmail = userData.contestant?.email;
//         const userIdData = userResponse.data.user.id;

//         const actorResponse = await axios.get(`${URL}/contestant/${actorId}`, {
//           headers: { Authorization: `${API_KEY}` },
//         });
//         const actorData = actorResponse.data;
//         const actorName = userData.contestant?.name || "Your selected contestant";



//         if (!userEmail || !actorName || !votes) {
//           console.error("Invalid email data:", { userEmail, actorName, votes });
//           return;
//         }
//   // Cast the votes after payment is confirmed
//   const votesData = {
//     userId: userIdData,
//     contestantId: actorId,
//     numberOfVotes: votes,
//   };

//   const votesResponse = await axios.post(`${URL}/votes-extra`, votesData, {
//     headers: { Authorization: `${API_KEY}` },
//   });

//   // Track the votes
//   const votesTrackerData = {
//     userId: userIdData,
//   contestantId: actorId,
//     email: currentUser.email,
//     numberOfVotes: votes,
//     round: 1,
//   };

//   await axios.post(`${URL}/votes-tracker`, votesTrackerData, {
//     headers: { Authorization: `${API_KEY}` },
//   });

//         try {
//           await sendThankYouEmail(userEmail, actorName, votes, actorEmail);
//           setFlashMessage("Thank you for your contribution and for helping this contestant win!");
//         } catch {
//           setFlashMessage("Your vote was processed, but we could not send a thank-you email.");
//         }

//         setProcessed(true);
//         setTimeout(() => {
//           navigate(`/actors/vote/${actorId}`);
//         }, 5000);
//       } catch (voteError) {
//         console.error("Error while updating votes:", voteError);
//         setFlashMessage("There was an issue processing your vote. Please try again later.");
//       }
//     };

//     if (!processed && actorId && votes) {
//       updateVotes(actorId, votes);
//     }
//   }, [searchParams, navigate, processed, currentUser, URL, API_KEY]);

//   return (
//     <div className="payment-success">
//       {processed ? (
//         <p className="flash-message">{flashMessage}</p>
//       ) : (
//         <p className="processing-message">Processing your vote...</p>
//       )}
//     </div>
//   );
// }

// export default PaymentSuccess;


import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import emailjs from "emailjs-com";
import axios from "axios";

const userThankYouId = process.env.REACT_APP_EMAILJS_USER_ID;
const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID_THANK_YOU;
const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID_THANK_YOU;

function PaymentSuccess({ URL, API_KEY, setErrorMessage }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();
  const [processed, setProcessed] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");

  const sendThankYouEmail = async (userEmail, actorName, actorEmail) => {
    const emailData = {
      voter_email: userEmail,
      actor_name: actorName,
      actor_email: actorEmail,
    };

    try {
      await emailjs.send(serviceId, templateId, emailData, userThankYouId);
    } catch (error) {
      console.error("Error sending thank-you email:", error.text || error);
    }
  };

  useEffect(() => {
    const actorId = searchParams.get("actorId");
    const votes = searchParams.get("votes");

    if (!actorId || !votes || loading || processed) return;

    if (!currentUser) {
      console.error("User not found. Authentication might be delayed.");
      return;
    }

    const updateVotes = async () => {
      try {
        // Get user info
        const userRes = await axios.get(`${URL}/users/${currentUser.uid}`, {
          headers: { Authorization: `${API_KEY}` },
        });

        const userData = userRes.data?.user;
        if (!userData) {
          setFlashMessage("User data not found.");
          return;
        }

        const userEmail = userData.email;
        const userId = userData.id;

        // Get actor info
        const actorRes = await axios.get(`${URL}/contestant/${actorId}`, {
          headers: { Authorization: `${API_KEY}` },
        });

        const actorData = actorRes.data?.contestant;
        if (!actorData) {
          setFlashMessage("Actor data not found.");
          return;
        }

        const actorName = actorData.name || "Your selected contestant";
        const actorEmail = actorData.email;

        // Submit extra votes
        const votePayload = {
          userId,
          contestantId: actorId,
          numberOfVotes: votes,
        };

        await axios.post(`${URL}/votes-extra`, votePayload, {
          headers: { Authorization: `${API_KEY}` },
        });

        // Submit vote tracker
        const trackerPayload = {
          userId,
          contestantId: actorId,
          email: userEmail,
          numberOfVotes: votes,
          round: 1,
        };

        await axios.post(`${URL}/votes-tracker`, trackerPayload, {
          headers: { Authorization: `${API_KEY}` },
        });

        // Send thank-you email (without vote count)
        await sendThankYouEmail(userEmail, actorName, actorEmail);

        setFlashMessage("Thank you for your contribution and for helping this contestant win!");
        setProcessed(true);

        setTimeout(() => {
          navigate(`/actors/vote/${actorId}`);
        }, 5000);
      } catch (error) {
        console.error("Vote update failed:", error);
        setFlashMessage("Something went wrong while processing your vote.");
      }
    };

    updateVotes();
  }, [searchParams, processed, currentUser, loading, URL, API_KEY, navigate]);

  return (
    <div className="payment-success">
      {processed ? (
        <p className="flash-message">{flashMessage}</p>
      ) : (
        <p className="processing-message">Processing your vote...</p>
      )}
    </div>
  );
}

export default PaymentSuccess;
