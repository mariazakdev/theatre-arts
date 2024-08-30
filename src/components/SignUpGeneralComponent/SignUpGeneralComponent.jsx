import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { auth, googleProvider, signInWithPopup } from "../../firebase";
import '../../styles/forms.scss';

const SignUpContestant = ({ URL, API_KEY }) => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [flashMessage, setFlashMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setFlashMessage("");

    if (password !== confirmPassword) {
      setFlashMessage("Passwords do not match.");
      return;
    }
    if (!email || !password || !confirmPassword) {
      setFlashMessage("Please fill in all the required fields.");
      return;
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setFlashMessage("Please enter a valid email address");
      return;
    }

    try {
      const response = await axios.get(`${URL}/users/email/${email}`, {
        headers: { Authorization: `${API_KEY}` },
      });

      if (response.data && response.data.userExists) {
        setFlashMessage("User with this email already exists.");
        setTimeout(() => {
          navigate(-1);
        }, 3000);
        return;
      }

      // Check if the user already exists in Firebase
      const existingUser = auth.currentUser;
      if (existingUser && existingUser.email === email && !existingUser.emailVerified) {
        await sendEmailVerification(existingUser);
        setFlashMessage("Verification email resent. Please check your inbox.");
        return;
      }

      const userCredential = await signup(email, password);
      if (!userCredential) {
        throw new Error("User signup failed. Please try again.");
      }
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);
      setFlashMessage("Verification email sent. Please check your inbox and verify your email.");

      const intervalId = setInterval(async () => {
        await user.reload();
        if (user.emailVerified) {
          clearInterval(intervalId);

          await axios.post(`${URL}/users`, {
            email: user.email,
            firebaseAuthId: user.uid,
            isContestant: false,          }, {
            headers: { Authorization: `${API_KEY}` },
          });
          setFlashMessage("Email verified! Redirecting to login...");

          setTimeout(() => {
            navigate(-1);
          }, 2000);
        }
      }, 3000);

    } catch (error) {
      console.error("Error during sign up:", error);
      setErrorMessage(error.message || "Failed to create user");
    }
  };

  const handleResendVerification = async () => {
    try {
      const user = auth.currentUser;
      if (user && !user.emailVerified) {
        await sendEmailVerification(user);
        setFlashMessage("Verification email resent. Please check your inbox.");
      }
    } catch (error) {
      if (error.code === 'auth/too-many-requests') {
        setErrorMessage("Too many requests. Please wait 15 minutes before trying again.");
      } else {
        console.error("Error resending verification email:", error);
        setErrorMessage("Failed to resend verification email.");
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
          isContestant: false,
        }, {
          headers: { Authorization: `${API_KEY}` },
        });
      }
      navigate("/login");
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
        <div className="form-background">
          <div className="form-container">
            {flashMessage && <p className="flash-message">{flashMessage}</p>}
            <h2>Contestant Sign Up</h2>

            <button onClick={handleGoogleSignIn} className="google-signin-button">
              Sign Up with Google
            </button>
            <p className="or-divider">
              <span>or</span>
            </p>
            <p className="form-description"> If signing up with your own email, you will need to verify your email.</p>
            <p className="form-description"> Create your unique secure password</p>

            <form onSubmit={onSubmit} noValidate>
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
                <span
                  className="input-group--password-toggle"
                  onClick={togglePasswordVisibility}
                >
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
                <span
                  className="input-group--password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
              <button type="submit">Sign up</button>
            </form>

            <p className="login-redirect">
              Already have an account?{" "}
              <NavLink to="/login">Log in</NavLink>
            </p>
              <div className="verify">
            <button className="resend-verification" onClick={handleResendVerification}> Resend verification email</button>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignUpContestant;
