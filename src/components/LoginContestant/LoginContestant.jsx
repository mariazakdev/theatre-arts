import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { auth, googleProvider, signInWithPopup } from "../../firebase"; 
import "../../styles/forms.scss";

function LoginContestant({ URL, API_KEY }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [flashMessage, setFlashMessage] = useState("");

  const onLogin = async (e) => {
    e.preventDefault();
    // Validation

    if (flashMessage) {
      setFlashMessage(""); // Clear the previous flash message
    }
    // Validation
    if (!email) {
      setFlashMessage("Please enter your email address");
      return;
    }

    if (!password) {
      setFlashMessage("Please enter your password");
      return;
    }

    try {
      const userCredential = await login(email, password);

      if (userCredential) {
        const user = userCredential.user;
        const firebaseId = user.uid;
        const userEmail = user.email;

        // Update the login function to include the firebase ID in the request payload
        const requestData = { email: userEmail, firebaseId };

        const response = await axios.post(`${URL}/users/login`, requestData, {
          headers: { Authorization: `${API_KEY}` },
        });

        const data = response.data;

        if (data.userId) {
          // Navigate to the desired path
          navigate("/contestant/enter");
        } else {
          setFlashMessage("User not found");
          console.log("User not found ");
        }
      } else {
        setFlashMessage("You have entered an invalid email or password");
        console.log("No user credentials received");

      }
    } 
    
    // catch (error) {
    //   console.error("Error logging in:", error);
    //   const errorCode = error.code;
    //   const errorMessage = error.message;
    //   setErrorMessage(errorMessage);
    //   setFlashMessage("Error logging in");
    //   console.log(errorCode, errorMessage);
    // }
    catch (error) {
      console.error("Error during login:", error);
    
      if (error.response) {
        // Backend-specific errors
        switch (error.response.status) {
          case 400:
            setFlashMessage("The email or password you entered is incorrect. Please double-check and try again.");
            break;
          case 404:
            setFlashMessage("We couldn't find an account with this email address. Redirecting you to sign up...");
            setTimeout(() => navigate("/contestant/signup"), 3000); // Delayed navigation
            break;
          case 500:
            setFlashMessage("We're experiencing some technical issues. Please try again later.");
            break;
          default:
            setFlashMessage("An unexpected error occurred. Please try again or contact support.");
        }
      } else if (error.code) {
        // Firebase or client-side errors
        switch (error.code) {
          case "auth/invalid-email":
            setFlashMessage("The email address you entered is invalid. Please use a valid email format, like example@domain.com.");
            break;
          case "auth/user-not-found":
            setFlashMessage("We couldn't find an account with this email. You may want to sign up for a new account.");
            break;
          case "auth/wrong-password":
            setFlashMessage("The password you entered is incorrect. If you've forgotten your password, use the 'Forgot Password' link below.");
            break;
          case "auth/too-many-requests":
            setFlashMessage("You've made too many attempts. Please wait a few minutes and try again.");
            break;
          default:
            setFlashMessage("An unexpected error occurred during authentication. Please try again.");
        }
      } else {
        // Network or unknown error
        setFlashMessage("Something went wrong. Please check your internet connection and try again.");
      }
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

      navigate("/contestant/enter");
    } 
  
    catch (error) {
      console.error("Error during Google sign in:", error);
    
      if (error.response) {
        // Backend-specific errors
        switch (error.response.status) {
          case 400:
            setFlashMessage("There was an issue processing your Google sign-in. Please try again.");
            break;
          case 404:
            setFlashMessage("We couldn't find your account. Redirecting you to sign up...");
            setTimeout(() => navigate("/contestant/signup"), 3000);
            break;
          case 500:
            setFlashMessage("We're experiencing technical difficulties. Please try signing in later.");
            break;
          default:
            setFlashMessage("An unexpected error occurred. Please try again.");
        }
      } else if (error.code) {
        // Firebase or client-side errors
        switch (error.code) {
          case "auth/popup-closed-by-user":
            setFlashMessage("The Google sign-in popup was closed before completing. Please try again.");
            break;
          case "auth/cancelled-popup-request":
            setFlashMessage("Multiple sign-in requests detected. Please close other popups and try again.");
            break;
          case "auth/network-request-failed":
            setFlashMessage("A network error occurred. Please check your connection and try again.");
            break;
          default:
            setFlashMessage("Something went wrong during Google sign-in. Please try again.");
        }
      } else {
        setFlashMessage("An unknown error occurred. Please check your connection and try again.");
      }
    }



  };






  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main>
      <section>
        <div className="form-container">
          <h2>Contestant Log In</h2>
          <p className="form-description"> Use same password you created in sign up</p>

          {flashMessage && <p className="flash-message">{flashMessage}</p>}
          <form onSubmit={onLogin} noValidate>
            <div className="input-group">
              <label htmlFor="email-address">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <p className="error-message">{emailError}</p>}
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && (
                <p className="error-message">{passwordError}</p>
              )}
              <span
                className="input-group--password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
            <div>
              <button>Login</button>
            </div>
            <p className="login-redirect">
              <NavLink to="/forgot-password">Forgot Password?</NavLink>
            </p>
          </form>

          <button onClick={handleGoogleSignIn} className="google-signin-button">
            Log In with Google
          </button>

          <p className="login-redirect">
            No account yet? <NavLink to="/contestant/signup">Sign up</NavLink>
          </p>
        </div>
      </section>
    </main>
  );
}

export default LoginContestant;
