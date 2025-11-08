import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { sendEmailVerification, fetchSignInMethodsForEmail } from "firebase/auth";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { auth, googleProvider, signInWithPopup } from "../../firebase";

import '../../styles/forms.scss';
import './SignUpContestant.scss';

const SignUpContestant = ({ URL, API_KEY }) => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [flashMessage, setFlashMessage] = useState({ type: "", message: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resendAttempts, setResendAttempts] = useState(0);
  const [isPolling, setIsPolling] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const MAX_RESEND_ATTEMPTS = 3;

const onSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true); // Disable button
  setFlashMessage({ type: "", message: "" });  // Clear previous flash and error messages
  setErrorMessage("");

  // Validation checks
  if (password !== confirmPassword) {
    setFlashMessage({ type: "error", message: "Passwords do not match." });
    setIsSubmitting(false); // Re-enable the button
    return;
  }

  if (!email || !password || !confirmPassword) {
    setFlashMessage({ type: "error", message: "Please fill in all the required fields." });
    setIsSubmitting(false); // Re-enable the button
    return;
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email)) {
    setFlashMessage({ type: "error", message: "Please enter a valid email address." });
    setIsSubmitting(false); // Re-enable the button
    return;
  }

  try {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);

    if (signInMethods.length > 0) {
      const user = auth.currentUser;

      if (user && !user.emailVerified) {
        // Resend verification email if the user exists but is not verified
        await sendEmailVerification(user);
        setFlashMessage({ type: "success", message: "Verification email resent. Please check your inbox and verify your email." });

        // Start polling for verification status
        setIsPolling(true);
        setIsSubmitting(false); // Re-enable the button
        return;
      } else if (user && user.emailVerified) {
        setErrorMessage("User with this email already exists and is verified. Please log in.");
        setIsSubmitting(false); // Re-enable the button
        return;
      }
    }

    // Proceed with sign-up if the user does not exist
    const userCredential = await signup(email, password);
    if (!userCredential) {
      throw new Error("User signup failed. Please try again.");
    }

    const user = userCredential.user;

    // Send verification email
    await sendEmailVerification(user);
    setFlashMessage({ type: "success", message: "Verification email sent. Please check your inbox and verify your email. Check your spam." });

    // Start polling for verification status
    setIsPolling(true);
  } catch (error) {
    console.error("Error during sign-up process:", {
      message: error.message,
      code: error.code,
      fullError: error,
    });

    if (error.code === 'auth/email-already-in-use') {
      // const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      const user = auth.currentUser;

      if (user && !user.emailVerified) {
        await sendEmailVerification(user);
        setFlashMessage({ type: "success", message: "Verification email resent. Please check your inbox and verify your email. Check your spam." });
        setIsPolling(true);
      } else if (user && user.emailVerified) {
        setErrorMessage("User with this email already exists and is verified. Please log in.");
      } else {
        setErrorMessage("Email is already in use. Please try logging in, or see if sign up incomplete : check your inbox for a verification email or resend verify.");
      }
    } else {
      setErrorMessage(error.message || "Failed to create user.");
    }
  } finally {
    setIsSubmitting(false); // Re-enable the button in all cases
  }
};


const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const response = await axios.get(`${URL}/users/email/${user.email}`, {
      headers: { Authorization: `${API_KEY}` },
    });

    if (!response.data.userExists) {
      await axios.post(`${URL}/users`, {
        email: user.email,
        firebaseAuthId: user.uid,
        isContestant: true,
      }, {
        headers: { Authorization: `${API_KEY}` },
      });
    }
    navigate("/contestant/login");
  } catch (error) {
    if (error.code === "auth/popup-closed-by-user") {
      console.error("Google sign-in failed: The user closed the sign-in popup before completing the sign-in process.");
      setErrorMessage("Sign-in process was interrupted. Please try again.");
    } else if (error.code === "auth/cancelled-popup-request") {
      console.error("Google sign-in failed: Multiple popups were opened, causing a conflict.");
      setErrorMessage("Multiple sign-in attempts detected. Please close other popups and try again.");
    } else if (error.code === "auth/network-request-failed") {
      console.error("Google sign-in failed: Network error occurred. Check your connection.");
      setErrorMessage("Network error. Please check your internet connection and try again.");
    } else if (error.response) {
      console.error("Google sign-in failed during backend interaction:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });
      setErrorMessage("Error communicating with the server. Please try again later.");
    } else {
      console.error("Unexpected error during Google sign-in:", error);
      setErrorMessage("An unexpected error occurred during sign-in. Please try again.");
    }
  }
};


  // const handleResendVerification = async () => {
  //   try {
  //     let user = auth.currentUser;

  //     if (!user) {
  //       setErrorMessage("No user is currently signed in. Please log in again.");
  //       return;
  //     }

  //     if (!user.emailVerified) {
  //       if (resendAttempts >= MAX_RESEND_ATTEMPTS) {
  //         setFlashMessage({ type: "error", message: "You've reached the maximum number of resend attempts. Please wait a few minutes before trying again." });
  //         return;
  //       }

  //       await sendEmailVerification(user);
  //       setFlashMessage({ type: "success", message: "Verification email resent. Please check your inbox." });
  //       setResendAttempts(resendAttempts + 1);

  //       // Start polling for verification status
  //       setIsPolling(true);
  //     } else {
  //       setFlashMessage({ type: "info", message: "Your email is already verified." });
  //     }
  //   } catch (error) {
  //     if (error.response && error.response.status === 409) {
  //       setErrorMessage("User with this email already exists in the backend. Please log in instead.");
  //       navigate("/contestant/login");
  //     }
  //     else if (error.code === 'auth/too-many-requests') {
  //       setFlashMessage({ type: "error", message: "Please wait a few minutes before trying again." });
  //     } else if (error.code === 'auth/user-token-expired' || error.code === 'auth/requires-recent-login') {
  //       setErrorMessage("Your session has expired. Please log in again.");
  //       navigate("/login");
  //     } else {
  //       console.error("Error resending verification email:", error);
  //       setErrorMessage("Failed to resend verification email.");
  //     }
  //   }
  // };

  // Poll for verification status every 3 seconds when isPolling is true
  useEffect(() => {
    let intervalId;
    if (isPolling) {
      intervalId = setInterval(async () => {
        const user = auth.currentUser;
        // console.log("Checking verification status...", user); // Debug log
        if (user) {
          await user.reload(); // Refresh user data
          // console.log("User reloaded. Email verified:", user.emailVerified); // Debug log
          if (user.emailVerified) {
            clearInterval(intervalId);
            setIsPolling(false); // Stop polling

            // Add the user to the backend database
            console.log("Adding user to backend and redirecting..."); // Debug log
            await axios.post(`${URL}/users`, {
              email: user.email,
              firebaseAuthId: user.uid,
              isContestant: true,
            }, {
              headers: { Authorization: `${API_KEY}` },
            });

            // Clear the flash message and redirect
            setFlashMessage({ type: "", message: "" });
            navigate("/contestant/login");
          }
        }
      }, 3000);
    }

    // Cleanup the interval when the component is unmounted or polling stops
    return () => clearInterval(intervalId);
  }, [isPolling, URL, API_KEY, navigate]);

  // Check if user is verified on page load
  useEffect(() => {
    const checkVerificationOnLoad = async () => {
      const user = auth.currentUser;
      // console.log("Checking verification on load...", user); // Debug log
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          // Add the user to the backend database
          console.log("User verified on load, adding to backend and redirecting..."); // Debug log
          await axios.post(`${URL}/users`, {
            email: user.email,
            firebaseAuthId: user.uid,
            isContestant: true,
          }, {
            headers: { Authorization: `${API_KEY}` },
          });

          // Redirect to login
          navigate("/contestant/login");
        }
      }
    };
    checkVerificationOnLoad();
  }, [URL, API_KEY, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main>
      <section>
        <div className="form-background">
          <div className="form-container">
            <h2>Contestant Sign Up</h2>
            <button onClick={handleGoogleSignIn} className="google-signin-button">
              Sign Up with Google
            </button>
            <p className="or-divider">
              <span>or</span>
            </p>
            <p className="form-description">If signing up with your own email, you will need to verify your email.</p>
            <form onSubmit={onSubmit} noValidate>
              {flashMessage.message && (
                <p className={`flash-message ${flashMessage.type}`}>
                  {flashMessage.message}
                </p>
              )}
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <div className="input-group">
                <label htmlFor="email-address">Email address</label>
                <input
                  type="email"
                  id="email-address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                <span className="input-group--password-toggle" onClick={togglePasswordVisibility}>
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
              <div className="input-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                />
                <span className="input-group--password-toggle" onClick={togglePasswordVisibility}>
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
              <button type="submit" disabled={isSubmitting} >Sign up</button>
            </form>
            <p className="login-redirect">
              Already have an account? <NavLink to="/login">Log in</NavLink>
            </p>
            {/* <div className="verify">
              <button className="resend-verification" onClick={handleResendVerification}>
                Resend verification email
              </button>
            </div> */}
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignUpContestant;
