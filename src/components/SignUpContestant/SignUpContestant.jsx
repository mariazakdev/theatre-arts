import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "../../styles/forms.scss";

const SignUpComponent = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      // Check if the user already exists
      const userExists = await checkIfUserExists(email);
      if (userExists) {
        navigate("/login");
        return;
      }
      // Continue with the signup process

      const userCredential = await signup(email, password);
      // Check if the userCredential contains a user object
      if (!userCredential || !userCredential.user) {
        throw new Error("No user credential returned from signup");
      }
      const user = userCredential.user;

      // Backend API call
      await axios.post("http://localhost:8000/users", {
        email: user.email,
        firebaseAuthId: user.uid,
        isContestant: true,
      });

      // Firestore document creation
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        hasCompletedAction: false,
        hasPaid: false,
        hasUploaded: false,
        isContestant: true,
        email: user.email, // Store email in Firestore (if not already)
      });

      navigate("/contestant/login");
    } catch (error) {
      console.error("Error during sign up:", error);
      setErrorMessage(error.message || "Failed to create user");
    }
  };

  return (
    <main>
      <section>
        <div>
          <div className="form-container">
            <h1>Sign Up to Participate</h1>
            <h3>
              You are helping your friend win, but also supporting children with
              disabilities
            </h3>
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
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                />
              </div>

              <div className="input-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm Password"
                />
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
