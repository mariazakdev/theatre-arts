import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import emailjs from "emailjs-com";

const userId = process.env.REACT_APP_EMAILJS_USER_ID;
const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID_THANK_YOU;
const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID_THANK_YOU;

const ThankYouEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  const { actorId, userData } = location.state || {};
  const { actorName, actorEmail } = userData || {};
  const voterEmail = currentUser?.email;

  useEffect(() => {
    console.log("Component mounted");
    console.log("Voter email (from auth):", voterEmail);
    console.log("Actor name/email:", actorName, actorEmail);

    if (voterEmail && actorName && actorEmail) {
      console.log("Attempting to send email...");
      emailjs
        .send(
          serviceId,
          templateId,
          {
            voter_email: voterEmail,
            actor_name: actorName,
            actor_email: actorEmail,
          },
          userId
        )
        .then(() => {
          console.log("✅ Thank-you email sent!");
        })
        .catch((err) => {
          console.error("❌ Email sending failed:", err);
        });
    } else {
      console.warn("Missing data for thank-you email", { voterEmail, actorName, actorEmail });
    }

    const timer = setTimeout(() => {
      if (actorId) {
                  navigate(`/actors/vote/${actorId}`);

      } else {
        navigate("/");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, actorId, voterEmail, actorName, actorEmail]);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Thank You!</h2>
      <p>We're sending you a thank-you email...</p>
      <p>You'll be redirected shortly.</p>
    </div>
  );
};

export default ThankYouEmailPage;
