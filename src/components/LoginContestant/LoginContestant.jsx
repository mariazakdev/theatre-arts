import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import "../../styles/forms.scss";

function LoginContestant({URL}) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onLogin = async (e) => {
    e.preventDefault();
    // Validation
    if (!email || !password) {
      setErrorMessage("Please enter email and password");
      return;
    }
  
    try {
      const userCredential = await login(email, password);
  
      if (userCredential) {
        const user = userCredential.user;
        const firebaseId = user.uid;
        const userEmail = user.email;
        console.log("User firebase ID:", firebaseId);
        console.log("User email:", userEmail);
  
        // Update the login function to include the firebase ID in the request payload
        const requestData = { email: userEmail, firebaseId };
        console.log("Data being sent to backend:", requestData);
  
        const response = await axios.post(`${URL}/users/login`, requestData);
  
        console.log("Response status:", response.status);
        console.log("Response data:", response.data);
  
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
