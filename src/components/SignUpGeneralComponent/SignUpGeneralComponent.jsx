import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import '../../styles/forms.scss';

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
      const userCredential = await signup(email, password);
      const user = userCredential.user;

      await axios.post("http://localhost:8000/users", {
        email: user.email,
        firebaseAuthId: user.uid,
        isContestant: true
      });

      navigate("/login");
    } catch (error) {
      console.error('Error during sign up:', error);
      setErrorMessage(error.message || 'Failed to create user');
    }
  };


  return (
    <main>
      <section>
        <div>
          <div className="form-container">
            <h1> Sign Up to Vote </h1>
            <h3>You are helping your friend win, but also supporting children with disabilies</h3>
            <form>
              {errorMessage && <p className="error-message">{errorMessage}</p>}

              <div className="input-group">
                <label htmlFor="email-address">Email address</label>
                <input
                  type="email"
                  label="Email address"
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
                  label="Create password"
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
                  label="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm Password"
                />
              </div>

              <button type="submit" onClick={onSubmit}>
                Sign up
              </button>
            </form>

            <p className="login-redirect">
              Already have an account? <NavLink to="login">Sign in</NavLink>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignUpComponent;
