import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "../../styles/forms.scss";


const SignUpComponent = ( {URL}) => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [flashMessage, setFlashMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Define the checkIfUserExists function


  // const onSubmit = async (e) => {
  //   e.preventDefault();
  
  //   if (password !== confirmPassword) {
  //      setErrorMessage("Passwords do not match.");
  //     return;
  //   }
  //   if (!email || !password || !confirmPassword) {
  //     setErrorMessage("Please fill in all the required fields.");
  //     return;
  //   }
  
  //   try {
  //     // Continue with the signup process
  //     const userCredential = await signup(email, password);
  
  //     // Check if the userCredential contains a user object
  //     if (!userCredential || !userCredential.user) {
  //       throw new Error("No user credential returned from signup");
  //     }
  
  //     const user = userCredential.user;
  
  //     // Backend API call
  //     await axios.post(`${URL}/users`, {
  //       email: user.email,
  //       firebaseAuthId: user.uid,
  //       isContestant: false,
  //     });
  
  //     // Firestore document creation
  //     const userDocRef = doc(db, "users", user.uid);
  //     await setDoc(userDocRef, {
  //       hasCompletedAction: false,
  //       hasPaid: false,
  //       hasUploaded: false,
  //       isContestant: false,
  //       email: user.email,
  //     });
  
  //     navigate(-1);
  //   } catch (error) {
  //     console.error("Error during sign up:", error);
  //     setErrorMessage(error.message || "Failed to create user");
  //   }
  // };
  
  // const onSubmit = async (e) => {
  //   e.preventDefault();
  
  //   if (password !== confirmPassword) {
  //     setErrorMessage("Passwords do not match.");
  //     return;
  //   }
  //   if (!email || !password || !confirmPassword) {
  //     setErrorMessage("Please fill in all the required fields.");
  //     return;
  //   }
  
  //   try {
  //     // Check if user already exists in the backend
  //     const response = await axios.get(`${URL}/users/email/${email}`);
  //     if (response.data) {
  //       setErrorMessage("User with this email already exists.");
  //       return;
  //     }
  
  //     // Continue with the signup process
  //     const userCredential = await signup(email, password);
  
  //     // Check if the userCredential contains a user object
  //     if (!userCredential || !userCredential.user) {
  //       throw new Error("No user credential returned from signup");
  //     }
  
  //     const user = userCredential.user;
  
  //     // Backend API call
  //     await axios.post(`${URL}/users`, {
  //       email: user.email,
  //       firebaseAuthId: user.uid,
  //       isContestant: false,
  //     });
  
  //     // Firestore document creation
  //     const userDocRef = doc(db, "users", user.uid);
  //     await setDoc(userDocRef, {
  //       hasCompletedAction: false,
  //       hasPaid: false,
  //       hasUploaded: false,
  //       isContestant: false,
  //       email: user.email,
  //     });
  
  //     navigate(-1);
  //   } catch (error) {
  //     console.error("Error during sign up:", error);
  //     setErrorMessage(error.message || "Failed to create user");
  //   }
  // };
  

//   const onSubmit = async (e) => {
//   e.preventDefault();

//   if (password !== confirmPassword) {
//     setErrorMessage("Passwords do not match.");
//     return;
//   }
//   if (!email || !password || !confirmPassword) {
//     setErrorMessage("Please fill in all the required fields.");
//     return;
//   }

//   try {
//     // Check if user already exists in the backend
//     const response = await axios.get(`${URL}/users/email/${email}`);
//     if (response.data) {
//       // If user exists, navigate to the login page after a delay
//       setTimeout(() => {
//         navigate("/login");
//       }, 3000); // Change the delay time as per your requirement
//       return;
//     }

//     // Continue with the signup process
//     const userCredential = await signup(email, password);

//     // Check if the userCredential contains a user object
//     if (!userCredential || !userCredential.user) {
//       throw new Error("No user credential returned from signup");
//     }

//     const user = userCredential.user;

//     // Backend API call
//     await axios.post(`${URL}/users`, {
//       email: user.email,
//       firebaseAuthId: user.uid,
//       isContestant: false,
//     });

//     // Firestore document creation
//     const userDocRef = doc(db, "users", user.uid);
//     await setDoc(userDocRef, {
//       hasCompletedAction: false,
//       hasPaid: false,
//       hasUploaded: false,
//       isContestant: false,
//       email: user.email,
//     });

//     navigate(-1);
//   } catch (error) {
//     console.error("Error during sign up:", error);
//     setErrorMessage(error.message || "Failed to create user");
//   }
// };

const onSubmit = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    setErrorMessage("Passwords do not match.");
    return;
  }
  if (!email || !password || !confirmPassword) {
    setErrorMessage("Please fill in all the required fields.");
    return;
  }

  try {
    // Check if user already exists in the backend
    const response = await axios.get(`${URL}/users/email/${email}`);
    if (response.data) {
      // If user exists, show flash message and navigate after a delay
      setFlashMessage("User with this email already exists.");
      setTimeout(() => {
        navigate("/login");
      }, 3000); // Change the delay time as per your requirement
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
    await axios.post(`${URL}/users`, {
      email: user.email,
      firebaseAuthId: user.uid,
      isContestant: false,
    });

    // Firestore document creation
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      hasCompletedAction: false,
      hasPaid: false,
      hasUploaded: false,
      isContestant: false,
      email: user.email,
    });

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

export default SignUpComponent;
