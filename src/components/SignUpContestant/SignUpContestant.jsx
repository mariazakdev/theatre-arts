import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import '../../styles/forms.scss';

const SignUpContestant = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [flashMessage, setFlashMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const checkIfUserExists = async (email) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/users/check-user?email=${email}`
      );
      return response.data.exists; // Adjust according to your API response
    } catch (error) {
      console.error("Error checking user existence:", error);
      return false; // Assuming non-existence if there's an error
    }
  };

 
  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      // Check if the user already exists
      const userExists = await checkIfUserExists(email);

      if (!userExists) {
        // Continue with the signup process for new users
        const userCredential = await signup(email, password);
        const user = userCredential.user;

        await axios.post("http://localhost:8000/users", {
          email: user.email,
          firebaseAuthId: user.uid,
          isContestant: true,
        });

        navigate("/contestant/login");
      } else {
        // User already exists, show flash message
        setFlashMessage("You are already signed up. Please log in.");
        // Set a timeout to navigate after setting the flash message
        setTimeout(() => {
          navigate("/login");
        }, 4000);
        return; // Exit the function to prevent further execution
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      setErrorMessage(error.message || "Failed to create user");
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
   < main>
    <section>
    <div className="form-background">
        <div className="form-container">
          {flashMessage && <p className="flash-message">{flashMessage}</p>}

          <h2>Sign Up</h2>
        
          <form onSubmit={onSubmit}>
            {errorMessage && <p className="error-message">{errorMessage}</p>}

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
                type={showPassword ? "text" : "password"} // Use the state to toggle between text and password type
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
                type={showPassword ? "text" : "password"} // Use the state to toggle between text and password type
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

export default SignUpContestant;