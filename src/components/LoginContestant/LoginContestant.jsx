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

        console.log(" ");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      const errorCode = error.code;
      const errorMessage = error.message;
      setErrorMessage(errorMessage);
      setFlashMessage("Error logging in");
      console.log(errorCode, errorMessage);
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
    } catch (error) {
      console.error("Error during Google sign in:", error);
      setErrorMessage(error.message || "Failed to sign in with Google");
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
              <NavLink to="/contestant/forgot-password">Forgot Password?</NavLink>
            </p>
          </form>

          <button onClick={handleGoogleSignIn} className="google-signin-button">
            Sign In with Google
          </button>

          <p className="login-redirect">
            No account yet? <NavLink to="/signup">Sign up</NavLink>
          </p>
        </div>
      </section>
    </main>
  );
}

export default LoginContestant;
