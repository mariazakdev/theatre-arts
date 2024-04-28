import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "../../styles/forms.scss";


const SignUpComponent = ( {URL, API_KEY}) => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [flashMessage, setFlashMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);


const onSubmit = async (e) => {
  e.preventDefault();
  if (flashMessage) {
    setFlashMessage(""); // Clear the previous flash message
  }
  if (password !== confirmPassword) {
    setFlashMessage("Passwords do not match.");
    return;
  }
  if (!email) {
    setFlashMessage("Please fill in all the required fields.");
    return;
  }
  if (!password ) {
    setFlashMessage("Please fill in all the required fields.");
    return;
  }
  if ( !confirmPassword) {
    setFlashMessage("Please fill in all the required fields.");
    return;
  }
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email)) {
    setFlashMessage("Please enter a valid email address");
    return;
  }

  try {
 
  // Check if user already exists in the backend
  const response = await axios.get(`${URL}/users/email/${email}`,
  { headers: { Authorization: `${API_KEY}` } }
  
  );
  if (response.data.userExists) {
    // If user exists, show flash message and navigate after a delay
    setFlashMessage("User with this email already exists.");
    setTimeout(() => {
      navigate("/login");
    }, 3000); // Change the delay time as per your requirement
    return;
  }


    
// Continue with the signup process for new users
const userCredential = await signup(email, password);
      const user = userCredential.user;

      // Backend API call
      await axios.post(`${URL}/users`, {
        email: user.email,
        firebaseAuthId: user.uid,
        isContestant: false,
      },
      { headers: { Authorization: `${API_KEY}` } }
      );

      navigate(-1);

  } catch (error) {
    console.error("Error during sign up:", error);
    setErrorMessage(error.message || "Failed to create user");
  }
};



   const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  return (
    <main>
      <section>
      <div className="form-background">
          <div className="form-container">
            {flashMessage && <p className="flash-message">{flashMessage}</p>}

            <h2>Sign Up</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <form onSubmit={onSubmit}>

              <div className="input-group">
                <label htmlFor="email-address">Email address</label>
                <input
                  type="email"
                  id="email-address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                  required
                  placeholder="Password"
                />
            <span 
                      className="input-group--password-toggle"
                      onClick={togglePasswordVisibility}>
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
                  required
                  placeholder="Confirm Password"
                />
      <span 
                      className="input-group--password-toggle"
                      onClick={togglePasswordVisibility}>
                         {showPassword ? "Hide" : "Show"}
                      </span>
              </div>

              <button type="submit">Sign up</button>
            </form>

            <p className="login-redirect">
              Already have an account?{" "}
              <NavLink to="/contestant/login">Log in</NavLink>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignUpComponent;
