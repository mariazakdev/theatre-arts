import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { auth, googleProvider, facebookProvider, twitterProvider, signInWithPopup }from "../../firebase";
import '../../styles/forms.scss';
import './SignUpContestant.scss';

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

      if (response.data.userExists) {
        setFlashMessage("User with this email already exists.");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
        return;
      }

      const userCredential = await signup(email, password);
      const user = userCredential.user;

      await axios.post(`${URL}/users`, {
        email: user.email,
        firebaseAuthId: user.uid,
        isContestant: true,
      }, {
        headers: { Authorization: `${API_KEY}` },
      });

      navigate("/contestant/login");
    } catch (error) {
      console.error("Error during sign up:", error);
      setErrorMessage(error.message || "Failed to create user");
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
      // const handleFacebookSignIn = async () => {
      //   try {
      //     const result = await signInWithPopup(auth, facebookProvider);
      //     const user = result.user;
      //     // Handle Facebook sign-in success
      //   } catch (error) {
      //     console.error("Error during Facebook sign in:", error);
      //     // Handle Facebook sign-in error
      //   }
      // };
    
      // const handleTwitterSignIn = async () => {
      //   try {
      //     const result = await signInWithPopup(auth, twitterProvider);
      //     const user = result.user;
      //     // Handle Twitter sign-in success
      //   } catch (error) {
      //     console.error("Error during Twitter sign in:", error);
      //     // Handle Twitter sign-in error
      //   }
      // };
      navigate("/contestant/dashboard");
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
            <button onClick={handleGoogleSignIn} className="google-signin-button">
              Sign Up with Google
            </button>
            {/* <button onClick={handleFacebookSignIn} className="facebook-signin-button">
              Sign Up with Facebook
            </button>
            <button onClick={handleTwitterSignIn} className="twitter-signin-button">
              Sign Up with Twitter
            </button> */}
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