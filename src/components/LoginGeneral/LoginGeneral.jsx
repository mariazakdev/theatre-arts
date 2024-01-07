import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";import axios from "axios";
import "../../styles/forms.scss";

function LoginGeneral() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onLogin = async (e) => {
    e.preventDefault();

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

        const response = await axios.post(
          "http://localhost:8000/users/login",
          requestData
        );

        console.log("Response status:", response.status);
        console.log("Response data:", response.data);

        const data = response.data;

        if (data.userId) {
          const userId = data.userId;
          const { state } = location || {};
          const returnPath = state?.returnPath || "/";
          const actorId = state?.actorId;

          if (returnPath === null) {
            console.log("No return path received");
            navigate("/");
          } else {
            navigate(returnPath, { state: { actorId, userId } });
          }
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
          <h2>Log In</h2>

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
                type={showPassword ? "text" : "password"} // Use the state to toggle between text and password type
                required
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
               <span 
                      className="input-group--password-toggle"
                      onClick={togglePasswordVisibility}>
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

export default LoginGeneral;