import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import emailjs from "emailjs-com";

const userId = process.env.REACT_APP_EMAILJS_USER_ID;
const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID_THANK_YOU;
const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID_THANK_YOU;

const ThankYouEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { actorId, userData } = location.state || {};

  useEffect(() => {
    if (userData?.email && userData?.actorName && userData?.actorEmail) {
      emailjs.send(
        serviceId,
        templateId,
        {
          voter_email: userData.email,
          actor_name: userData.actorName,
          actor_email: userData.actorEmail,
        },
        userId
      )
        .then(() => {
          console.log("Thank-you email sent!");
        })
        .catch((err) => {
          console.error("Email sending failed:", err);
        });
    }

    const timer = setTimeout(() => {
      if (actorId) {
        navigate(`/actor/${actorId}`);
      } else {
        navigate("/");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, actorId, userData]);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Thank You!</h2>
      <p>We're sending you a thank-you email...</p>
      <p>You'll be redirected shortly.</p>
    </div>
  );
};

export default ThankYouEmailPage;
