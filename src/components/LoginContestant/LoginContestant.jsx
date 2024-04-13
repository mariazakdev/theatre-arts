import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
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

  const onLogin = async (e) => {
    e.preventDefault();
    // Validation
    setEmailError("");
    setPasswordError("");
    if (!email || !password) {
      setErrorMessage("Please enter email and password");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("Please enter a valid email address");
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
          console.log("User not found on the server side");
        }
      } else {
        console.log("No user credentials received");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
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
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form>
            <div className="input-group">
              <label htmlFor="email-address">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
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
                required
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
              <button onClick={onLogin}>Login</button>
            </div>
            <p className="login-redirect">
              <NavLink to="/forgot-password">Forgot Password?</NavLink>
            </p>
          </form>

          <p className="login-redirect">
            No account yet? <NavLink to="/signup">Sign up</NavLink>
          </p>
        </div>
      </section>
    </main>
  );
}

export default LoginContestant;
