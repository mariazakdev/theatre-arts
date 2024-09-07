
// import React, { useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { sendEmailVerification, fetchSignInMethodsForEmail , EmailAuthProvider, reauthenticateWithCredential} from "firebase/auth";
// import { useAuth } from "../../contexts/AuthContext";
// import axios from "axios";
// import { auth, googleProvider, signInWithPopup } from "../../firebase";
// import '../../styles/forms.scss';
// import './SignUpContestant.scss';

// const SignUpContestant = ({ URL, API_KEY }) => {
//   const navigate = useNavigate();
//   const { signup } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [flashMessage, setFlashMessage] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [resendAttempts, setResendAttempts] = useState(0); // Initialize the resendAttempts state

//   const MAX_RESEND_ATTEMPTS = 3; // Maximum number of attempts allowed

 
// const onSubmit = async (e) => {
//   e.preventDefault();
//   setFlashMessage("");
//   setErrorMessage("");

//   if (password !== confirmPassword) {
//       setFlashMessage("Passwords do not match.");
//       return;
//   }
//   if (!email || !password || !confirmPassword) {
//       setFlashMessage("Please fill in all the required fields.");
//       return;
//   }
//   const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   if (!emailPattern.test(email)) {
//       setFlashMessage("Please enter a valid email address");
//       return;
//   }

//   try {
//       // Check if the user already exists in Firebase
//       const signInMethods = await fetchSignInMethodsForEmail(auth, email);
//       if (signInMethods.length > 0) {
//           const user = auth.currentUser;

//           if (user && !user.emailVerified) {
//               setErrorMessage("Email is already in use. Please verify your email to complete the sign-up process.");
//               return;
//           } else {
//               setErrorMessage("User with this email already exists and is verified.");
//               return;
//           }
//       }

//       const userCredential = await signup(email, password);
//       if (!userCredential) {
//           throw new Error("User signup failed. Please try again.");
//       }
//       const user = userCredential.user;

//       // Send email verification
//       await sendEmailVerification(user);
//       setFlashMessage("Verification email sent. Please check your inbox and verify your email.");

//       // Poll for email verification status
//       const intervalId = setInterval(async () => {
//         await user.reload(); // Refresh user data
//         if (user.emailVerified) {
//             clearInterval(intervalId);

//             // Add the user to the backend database
//             await axios.post(`${URL}/users`, {
//                 email: user.email,
//                 firebaseAuthId: user.uid,
//                 isContestant: true,
//             }, {
//                 headers: { Authorization: `${API_KEY}` },
//             });

//             setFlashMessage("Email verified! Redirecting to login...");
//             setTimeout(() => {
//                 navigate("/login");
//             }, 2000);
//         }
//       }, 3000);

//   } catch (error) {
//       if (error.code === 'auth/email-already-in-use') {
//           setErrorMessage("Email is already in use. Please verify your email or log in.");
//       } else {
//           console.error("Error during sign up:", error);
//           setErrorMessage(error.message || "Failed to create user");
//       }
//   }
// };




// // const handleResendVerification = async () => {
// //   try {
// //       const user = auth.currentUser;
// //       if (user) {
// //           if (!user.emailVerified) {
// //               await sendEmailVerification(user);
// //               setFlashMessage("Verification email resent. Please check your inbox.");
// //           } else {
// //               setFlashMessage("Your email is already verified.");
// //           }
// //       } else {
// //           setErrorMessage("No user is currently signed in.");
// //       }
// //   } catch (error) {
// //       if (error.code === 'auth/too-many-requests') {
// //           setErrorMessage("Too many requests. Please wait 15 minutes before trying again.");
// //       } else {
// //           console.error("Error resending verification email:", error);
// //           setErrorMessage("Failed to resend verification email.");
// //       }
// //   }
// // };

// const handleCheckVerification = async () => {
//   try {
//     const user = auth.currentUser;
//     if (user) {
//       await user.reload(); // Refresh user data
//       if (user.emailVerified) {
//         // Add the user to the backend database
//         await axios.post(`${URL}/users`, {
//           email: user.email,
//           firebaseAuthId: user.uid,
//           isContestant: true,
//         }, {
//           headers: { Authorization: `${API_KEY}` },
//         });

//         setFlashMessage("Email verified! Redirecting to login...");
//         setTimeout(() => {
//           navigate("/login");
//         }, 2000);
//       } else {
//         setFlashMessage("Email is not verified yet. Please verify your email and try again.");
//       }
//     } else {
//       setErrorMessage("No user is currently signed in.");
//     }
//   } catch (error) {
//     console.error("Error during email verification check:", error);
//     setErrorMessage("Failed to verify email.");
//   }
// };

// // // const handleResendVerification = async () => {
// // //   try {
// // //       const user = auth.currentUser;
// // //       if (user) {
// // //           if (!user.emailVerified) {
// // //               await sendEmailVerification(user);
// // //               setFlashMessage("Verification email resent. Please check your inbox.");
// // //           } else {
// // //               setFlashMessage("Your email is already verified.");
// // //           }
// // //       } else {
// // //           setErrorMessage("No user is currently signed in.");
// // //       }
// // //   } catch (error) {
// // //       if (error.code === 'auth/too-many-requests') {
// // //           setErrorMessage("Too many requests. Please wait 15 minutes before trying again.");
// // //       } else {
// // //           console.error("Error resending verification email:", error);
// // //           setErrorMessage("Failed to resend verification email.");
// // //       }
// // //   }
// // // };
// // const handleResendVerification = async () => {
// //   if (resendAttempts >= MAX_RESEND_ATTEMPTS) {
// //     setFlashMessage("You've reached the maximum number of resend attempts. Please wait a few minutes before trying again.");
// //     return;
// //   }

// //   try {
// //     const user = auth.currentUser;
// //     if (user) {
// //       if (!user.emailVerified) {
// //         await sendEmailVerification(user);
// //         setFlashMessage("Verification email resent. Please check your inbox.");
// //         setResendAttempts(resendAttempts + 1); // Increment the attempt counter
// //       } else {
// //         setFlashMessage("Your email is already verified.");
// //       }
// //     } else {
// //       setErrorMessage("No user is currently signed in.");
// //     }
// //   } catch (error) {
// //     // Silently handle the "too many requests" error or log it
// //     if (error.code === 'auth/too-many-requests') {
// //       console.log("Too many requests. The user will need to wait before trying again.");
// //       setFlashMessage("Please wait a few minutes before trying again.");
// //     } else {
// //       console.error("Error resending verification email:", error);
// //       setErrorMessage("Failed to resend verification email.");
// //     }
// //   }
// // };


// const handleResendVerification = async () => {
//   let user = auth.currentUser;

//   if (!user) {
//     setErrorMessage("No user is currently signed in. Please log in again.");
//     return;
//   }

//   // Attempt to re-authenticate the user
//   try {
//     const credential = EmailAuthProvider.credential(user.email, password); // Prompt user for password
//     await reauthenticateWithCredential(user, credential);
//     user = auth.currentUser; // Refresh the currentUser after re-authentication
//   } catch (reauthError) {
//     setErrorMessage("Re-authentication failed. Please log in again.");
//     navigate("/login");
//     return;
//   }

//   if (resendAttempts >= MAX_RESEND_ATTEMPTS) {
//     setFlashMessage("You've reached the maximum number of resend attempts. Please wait a few minutes before trying again.");
//     return;
//   }

//   try {
//     if (!user.emailVerified) {
//       await sendEmailVerification(user);
//       setFlashMessage("Verification email resent. Please check your inbox.");
//       setResendAttempts(resendAttempts + 1); // Increment the attempt counter
//     } else {
//       setFlashMessage("Your email is already verified.");
//     }
//   } catch (error) {
//     if (error.code === 'auth/too-many-requests') {
//       console.log("Too many requests. The user will need to wait before trying again.");
//       setFlashMessage("Please wait a few minutes before trying again.");
//     } else {
//       console.error("Error resending verification email:", error);
//       setErrorMessage("Failed to resend verification email.");
//     }
//   }
// };

//   const handleGoogleSignIn = async () => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const user = result.user;

//       const response = await axios.get(`${URL}/users/email/${user.email}`, {
//         headers: { Authorization: `${API_KEY}` },
//       });

//       if (!response.data.userExists) {
//         await axios.post(`${URL}/users`, {
//           email: user.email,
//           firebaseAuthId: user.uid,
//           isContestant: true,
//         }, {
//           headers: { Authorization: `${API_KEY}` },
//         });
//       }
//       navigate("/login");
//     } catch (error) {
//       console.error("Error during Google sign in:", error);
//       setErrorMessage(error.message || "Failed to sign in with Google");
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <main>
//       <section>
//         <div className="form-background">
//           <div className="form-container">
          
//             <h2>Contestant Sign Up</h2>

//             <button onClick={handleGoogleSignIn} className="google-signin-button">
//               Sign Up with Google
//             </button>
//             <p className="or-divider">
//               <span>or</span>
//             </p>
//             <p className="form-description"> If signing up with your own email, you will need to verify your email.</p>
//             <p className="form-description"> Create your unique secure password</p>

//             <form onSubmit={onSubmit} noValidate>
//             {flashMessage && <p className="flash-message">{flashMessage}</p>}
//               {errorMessage && <p className="error-message">{errorMessage}</p>}
//               <div className="input-group">
//                 <label htmlFor="email-address">Email address</label>
//                 <input
//                   type="email"
//                   id="email-address"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Email address"
//                 />
//               </div>
//               <div className="input-group">    
//                 <label htmlFor="password">Password</label>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   id="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Password"
//                 />
//                 <span
//                   className="input-group--password-toggle"
//                   onClick={togglePasswordVisibility}
//                 >
//                   {showPassword ? "Hide" : "Show"}
//                 </span>
//               </div>
//               <div className="input-group">
//                 <label htmlFor="confirm-password">Confirm Password</label>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   id="confirm-password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   placeholder="Confirm Password"
//                 />
//                 <span
//                   className="input-group--password-toggle"
//                   onClick={togglePasswordVisibility}
//                 >
//                   {showPassword ? "Hide" : "Show"}
//                 </span>
//               </div>
//               <button type="submit">Sign up</button>
//             </form>

//             <p className="login-redirect">
//               Already have an account?{" "}
//               <NavLink to="/login">Log in</NavLink>
//             </p>
//             <div className="verify">
//             <button className="resend-verification" onClick={handleResendVerification}> Resend verification email</button>

//             </div>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// };

// export default SignUpContestant;

// import React, { useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { sendEmailVerification, fetchSignInMethodsForEmail } from "firebase/auth";
// import { useAuth } from "../../contexts/AuthContext";
// import axios from "axios";
// import { auth, googleProvider, signInWithPopup } from "../../firebase";
// import '../../styles/forms.scss';
// import './SignUpContestant.scss';

// const SignUpContestant = ({ URL, API_KEY }) => {
//   const navigate = useNavigate();
//   const { signup } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [flashMessage, setFlashMessage] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [resendAttempts, setResendAttempts] = useState(0);

//   const MAX_RESEND_ATTEMPTS = 3;

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setFlashMessage("");
//     setErrorMessage("");

//     if (password !== confirmPassword) {
//       setFlashMessage("Passwords do not match.");
//       return;
//     }
//     if (!email || !password || !confirmPassword) {
//       setFlashMessage("Please fill in all the required fields.");
//       return;
//     }

//     const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!emailPattern.test(email)) {
//       setFlashMessage("Please enter a valid email address.");
//       return;
//     }

//     try {
//       const signInMethods = await fetchSignInMethodsForEmail(auth, email);
//       if (signInMethods.length > 0) {
//         const user = auth.currentUser;
//         if (user && !user.emailVerified) {
//           setErrorMessage("Email is already in use. Please verify your email to complete the sign-up process.");
//           return;
//         } else {
//           setErrorMessage("User with this email already exists and is verified.");
//           return;
//         }
//       }

//       const userCredential = await signup(email, password);
//       if (!userCredential) {
//         throw new Error("User signup failed. Please try again.");
//       }
//       const user = userCredential.user;

//       console.log("User after signup:", auth.currentUser); // Check current user

//       await sendEmailVerification(user);
//       setFlashMessage("Verification email sent. Please check your inbox and verify your email.");

//       const intervalId = setInterval(async () => {
//         await user.reload();
//         if (user.emailVerified) {
//           clearInterval(intervalId);
//           await axios.post(`${URL}/users`, {
//             email: user.email,
//             firebaseAuthId: user.uid,
//             isContestant: true,
//           }, {
//             headers: { Authorization: `${API_KEY}` },
//           });
//           setFlashMessage("Email verified! Redirecting to login...");
//           setTimeout(() => {
//             navigate("/login");
//           }, 2000);
//         }
//       }, 3000);

//     } catch (error) {
//       if (error.code === 'auth/email-already-in-use') {
//         setErrorMessage("Email is already in use. Please verify your email or log in.");
//       } else {
//         console.error("Error during sign up:", error);
//         setErrorMessage(error.message || "Failed to create user.");
//       }
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const user = result.user;

//       const response = await axios.get(`${URL}/users/email/${user.email}`, {
//         headers: { Authorization: `${API_KEY}` },
//       });

//       if (!response.data.userExists) {
//         await axios.post(`${URL}/users`, {
//           email: user.email,
//           firebaseAuthId: user.uid,
//           isContestant: true,
//         }, {
//           headers: { Authorization: `${API_KEY}` },
//         });
//       }
//       navigate("/login");
//     } catch (error) {
//       console.error("Error during Google sign in:", error);
//       setErrorMessage(error.message || "Failed to sign in with Google");
//     }
//   };

//   const handleResendVerification = async () => {
//     try {
//       let user = auth.currentUser;
  
//       // Check if the user is signed in
//       if (!user) {
//         setErrorMessage("No user is currently signed in. Please log in again.");
//         return;
//       }
  
//       // Check if the user's email is not verified
//       if (!user.emailVerified) {
//         // Prevent too many resend attempts
//         if (resendAttempts >= MAX_RESEND_ATTEMPTS) {
//           setFlashMessage("You've reached the maximum number of resend attempts. Please wait a few minutes before trying again.");
//           return;
//         }
  
//         // Resend the verification email
//         await sendEmailVerification(user);
//         setFlashMessage("Verification email resent. Please check your inbox.");
//         setResendAttempts(resendAttempts + 1);
//       } else {
//         setFlashMessage("Your email is already verified.");
//       }
//     } catch (error) {
//       if (error.code === 'auth/too-many-requests') {
//         setFlashMessage("Please wait a few minutes before trying again.");
//       } else if (error.code === 'auth/user-token-expired' || error.code === 'auth/requires-recent-login') {
//         // Only redirect to login if the user's session has expired
//         setErrorMessage("Your session has expired. Please log in again.");
//         navigate("/login");
//       } else {
//         console.error("Error resending verification email:", error);
//         setErrorMessage("Failed to resend verification email.");
//       }
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <main>
//       <section>
//         <div className="form-background">
//           <div className="form-container">
//             <h2>Contestant Sign Up</h2>
//             <button onClick={handleGoogleSignIn} className="google-signin-button">
//               Sign Up with Google
//             </button>
//             <p className="or-divider">
//               <span>or</span>
//             </p>
//             <p className="form-description">If signing up with your own email, you will need to verify your email.</p>
//             <form onSubmit={onSubmit} noValidate>
//               {flashMessage && <p className="flash-message">{flashMessage}</p>}
//               {errorMessage && <p className="error-message">{errorMessage}</p>}
//               <div className="input-group">
//                 <label htmlFor="email-address">Email address</label>
//                 <input
//                   type="email"
//                   id="email-address"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Email address"
//                 />
//               </div>
//               <div className="input-group">
//                 <label htmlFor="password">Password</label>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   id="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Password"
//                 />
//                 <span className="input-group--password-toggle" onClick={togglePasswordVisibility}>
//                   {showPassword ? "Hide" : "Show"}
//                 </span>
//               </div>
//               <div className="input-group">
//                 <label htmlFor="confirm-password">Confirm Password</label>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   id="confirm-password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   placeholder="Confirm Password"
//                 />
//                 <span className="input-group--password-toggle" onClick={togglePasswordVisibility}>
//                   {showPassword ? "Hide" : "Show"}
//                 </span>
//               </div>
//               <button type="submit">Sign up</button>
//             </form>
//             <p className="login-redirect">
//               Already have an account? <NavLink to="/login">Log in</NavLink>
//             </p>
//             <div className="verify">
//               <button className="resend-verification" onClick={handleResendVerification}>
//                 Resend verification email
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// };

// export default SignUpContestant;

// import React, { useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { sendEmailVerification, fetchSignInMethodsForEmail } from "firebase/auth";
// import { useAuth } from "../../contexts/AuthContext";
// import axios from "axios";
// import { auth, googleProvider, signInWithPopup } from "../../firebase";
// import '../../styles/forms.scss';
// import './SignUpContestant.scss';

// const SignUpContestant = ({ URL, API_KEY }) => {
//   const navigate = useNavigate();
//   const { signup } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [flashMessage, setFlashMessage] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [resendAttempts, setResendAttempts] = useState(0);
//   const [canResend, setCanResend] = useState(true); // Controls whether the user can resend the verification email
//   const [isPolling, setIsPolling] = useState(false);

//   const MAX_RESEND_ATTEMPTS = 3;

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setFlashMessage("");
//     setErrorMessage("");

//     if (password !== confirmPassword) {
//       setFlashMessage("Passwords do not match.");
//       return;
//     }
//     if (!email || !password || !confirmPassword) {
//       setFlashMessage("Please fill in all the required fields.");
//       return;
//     }

//     const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!emailPattern.test(email)) {
//       setFlashMessage("Please enter a valid email address.");
//       return;
//     }

//     try {
//       const signInMethods = await fetchSignInMethodsForEmail(auth, email);
//       if (signInMethods.length > 0) {
//         const user = auth.currentUser;
//         if (user && !user.emailVerified) {
//           setErrorMessage("Email is already in use. Please verify your email to complete the sign-up process.");
//           return;
//         } else {
//           setErrorMessage("User with this email already exists and is verified.");
//           return;
//         }
//       }

//       const userCredential = await signup(email, password);
//       if (!userCredential) {
//         throw new Error("User signup failed. Please try again.");
//       }
//       const user = userCredential.user;

//       console.log("User after signup:", auth.currentUser); // Check current user

//       await sendEmailVerification(user);
//       setFlashMessage("Verification email sent. Please check your inbox and verify your email.");

//       const intervalId = setInterval(async () => {
//         await user.reload();
//         if (user.emailVerified) {
//           clearInterval(intervalId);
//           await axios.post(`${URL}/users`, {
//             email: user.email,
//             firebaseAuthId: user.uid,
//             isContestant: true,
//           }, {
//             headers: { Authorization: `${API_KEY}` },
//           });
//           setFlashMessage("Email verified! Redirecting to login...");
//           setTimeout(() => {
//             navigate("/login");
//           }, 2000);
//         }
//       }, 3000);

//     } catch (error) {
//       if (error.code === 'auth/email-already-in-use') {
//         setErrorMessage("Email is already in use. Please verify your email or log in.");
//       } else {
//         console.error("Error during sign up:", error);
//         setErrorMessage(error.message || "Failed to create user.");
//       }
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const user = result.user;

//       const response = await axios.get(`${URL}/users/email/${user.email}`, {
//         headers: { Authorization: `${API_KEY}` },
//       });

//       if (!response.data.userExists) {
//         await axios.post(`${URL}/users`, {
//           email: user.email,
//           firebaseAuthId: user.uid,
//           isContestant: true,
//         }, {
//           headers: { Authorization: `${API_KEY}` },
//         });
//       }
//       navigate("/login");
//     } catch (error) {
//       console.error("Error during Google sign in:", error);
//       setErrorMessage(error.message || "Failed to sign in with Google");
//     }
//   };

//   const handleResendVerification = async () => {
//     if (!canResend) {
//       setFlashMessage("Please wait before trying again.");
//       return;
//     }

//     try {
//       let user = auth.currentUser;
  
//       // Check if the user is signed in
//       if (!user) {
//         setErrorMessage("No user is currently signed in. Please log in again.");
//         return;
//       }
  
//       // Check if the user's email is not verified
//       if (!user.emailVerified) {
//         // Prevent too many resend attempts
//         if (resendAttempts >= MAX_RESEND_ATTEMPTS) {
//           setFlashMessage("You've reached the maximum number of resend attempts. Please wait a few minutes before trying again.");
//           return;
//         }
  
//         // Resend the verification email
//         await sendEmailVerification(user);
//         setFlashMessage("Verification email resent. Please check your inbox.");
//         setResendAttempts(resendAttempts + 1);
//         setCanResend(false); // Disable further resends for 1 minute

//         // Allow resending after 1 minute
//         setTimeout(() => {
//           setCanResend(true);
//         }, 60000);
//       } else {
//         setFlashMessage("Your email is already verified.");
//       }
//     } catch (error) {
//       if (error.code === 'auth/too-many-requests') {
//         setFlashMessage("Please wait a few minutes before trying again.");
//       } else if (error.code === 'auth/user-token-expired' || error.code === 'auth/requires-recent-login') {
//         // Only redirect to login if the user's session has expired
//         setErrorMessage("Your session has expired. Please log in again.");
//         navigate("/login");
//       } else {
//         console.error("Error resending verification email:", error);
//         setErrorMessage("Failed to resend verification email.");
//       }
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <main>
//       <section>
//         <div className="form-background">
//           <div className="form-container">
//             <h2>Contestant Sign Up</h2>
//             <button onClick={handleGoogleSignIn} className="google-signin-button">
//               Sign Up with Google
//             </button>
//             <p className="or-divider">
//               <span>or</span>
//             </p>
//             <p className="form-description">If signing up with your own email, you will need to verify your email.</p>
//             <form onSubmit={onSubmit} noValidate>
//               {flashMessage && <p className="flash-message">{flashMessage}</p>}
//               {errorMessage && <p className="error-message">{errorMessage}</p>}
//               <div className="input-group">
//                 <label htmlFor="email-address">Email address</label>
//                 <input
//                   type="email"
//                   id="email-address"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Email address"
//                 />
//               </div>
//               <div className="input-group">
//                 <label htmlFor="password">Password</label>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   id="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Password"
//                 />
//                 <span className="input-group--password-toggle" onClick={togglePasswordVisibility}>
//                   {showPassword ? "Hide" : "Show"}
//                 </span>
//               </div>
//               <div className="input-group">
//                 <label htmlFor="confirm-password">Confirm Password</label>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   id="confirm-password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   placeholder="Confirm Password"
//                 />
//                 <span className="input-group--password-toggle" onClick={togglePasswordVisibility}>
//                   {showPassword ? "Hide" : "Show"}
//                 </span>
//               </div>
//               <button type="submit">Sign up</button>
//             </form>
//             <p className="login-redirect">
//               Already have an account? <NavLink to="/login">Log in</NavLink>
//             </p>
//             <div className="verify">
//               <button className="resend-verification" onClick={handleResendVerification} disabled={!canResend}>
//                 Resend verification email
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// };

// export default SignUpContestant;

import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { sendEmailVerification, fetchSignInMethodsForEmail } from "firebase/auth";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { auth, googleProvider, signInWithPopup } from "../../firebase";
import '../../styles/forms.scss';
import './SignUpContestant.scss';

const SignUpContestant = ({ URL, API_KEY }) => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [flashMessage, setFlashMessage] = useState({ type: "", message: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resendAttempts, setResendAttempts] = useState(0);
  const [isPolling, setIsPolling] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_RESEND_ATTEMPTS = 3;

 
const onSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true); // Disable button

  setFlashMessage({ type: "", message: "" });
  setErrorMessage("");

  if (password !== confirmPassword) {
      setFlashMessage({ type: "error", message: "Passwords do not match." });
      return;
  }
  if (!email || !password || !confirmPassword) {
      setFlashMessage({ type: "error", message: "Please fill in all the required fields." });
      return;
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email)) {
      setFlashMessage({ type: "error", message: "Please enter a valid email address." });
      return;
  }

  try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);

      if (signInMethods.length > 0) {
          const user = auth.currentUser;

          if (user && !user.emailVerified) {
              // User exists and email is not verified, resend verification email
              await sendEmailVerification(user);
              setFlashMessage({ type: "success", message: "Verification email resent. Please check your inbox and verify your email." });

              // Start polling for verification status
              setIsPolling(true);
              return;
          } else if (user && user.emailVerified) {
              setErrorMessage("User with this email already exists and is verified. Please log in.");
              return;
          }
      }

      // If the user doesn't exist in Firebase, proceed with sign-up
      const userCredential = await signup(email, password);
      if (!userCredential) {
          throw new Error("User signup failed. Please try again.");
      }
      const user = userCredential.user;

      await sendEmailVerification(user);
      setFlashMessage({ type: "success", message: "Verification email sent. Please check your inbox and verify your email." });

      // Start polling for verification status
      setIsPolling(true);

  } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
          // If the email is already in use, check if the user exists and is not verified
          const signInMethods = await fetchSignInMethodsForEmail(auth, email);
          const user = auth.currentUser;
          if (user && !user.emailVerified) {
              await sendEmailVerification(user);
              setFlashMessage({ type: "success", message: "Verification email resent. Please check your inbox and verify your email." });
              setIsPolling(true);
          } else if (user && user.emailVerified) {
              setErrorMessage("User with this email already exists and is verified. Please log in.");
          } else {
              setErrorMessage("Email is already in use. Check your inbox for a verification email and log in.");
          }
      } else {
          console.error("Error during sign up:", error);
          setErrorMessage(error.message || "Failed to create user.");
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
          isContestant: true,
        }, {
          headers: { Authorization: `${API_KEY}` },
        });
      }
      navigate("/contestant/login");
    } catch (error) {
      console.error("Error during Google sign in:", error);
      setErrorMessage(error.message || "Failed to sign in with Google");
    }
  };

  const handleResendVerification = async () => {
    try {
      let user = auth.currentUser;

      if (!user) {
        setErrorMessage("No user is currently signed in. Please log in again.");
        return;
      }

      if (!user.emailVerified) {
        if (resendAttempts >= MAX_RESEND_ATTEMPTS) {
          setFlashMessage({ type: "error", message: "You've reached the maximum number of resend attempts. Please wait a few minutes before trying again." });
          return;
        }

        await sendEmailVerification(user);
        setFlashMessage({ type: "success", message: "Verification email resent. Please check your inbox." });
        setResendAttempts(resendAttempts + 1);

        // Start polling for verification status
        setIsPolling(true);
      } else {
        setFlashMessage({ type: "info", message: "Your email is already verified." });
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage("User with this email already exists in the backend. Please log in instead.");
        navigate("/contestant/login");
      }
      else if (error.code === 'auth/too-many-requests') {
        setFlashMessage({ type: "error", message: "Please wait a few minutes before trying again." });
      } else if (error.code === 'auth/user-token-expired' || error.code === 'auth/requires-recent-login') {
        setErrorMessage("Your session has expired. Please log in again.");
        navigate("/login");
      } else {
        console.error("Error resending verification email:", error);
        setErrorMessage("Failed to resend verification email.");
      }
    }
  };

  // Poll for verification status every 3 seconds when isPolling is true
  useEffect(() => {
    let intervalId;
    if (isPolling) {
      intervalId = setInterval(async () => {
        const user = auth.currentUser;
        // console.log("Checking verification status...", user); // Debug log
        if (user) {
          await user.reload(); // Refresh user data
          // console.log("User reloaded. Email verified:", user.emailVerified); // Debug log
          if (user.emailVerified) {
            clearInterval(intervalId);
            setIsPolling(false); // Stop polling

            // Add the user to the backend database
            console.log("Adding user to backend and redirecting..."); // Debug log
            await axios.post(`${URL}/users`, {
              email: user.email,
              firebaseAuthId: user.uid,
              isContestant: true,
            }, {
              headers: { Authorization: `${API_KEY}` },
            });

            // Clear the flash message and redirect
            setFlashMessage({ type: "", message: "" });
            navigate("/contestant/login");
          }
        }
      }, 3000);
    }

    // Cleanup the interval when the component is unmounted or polling stops
    return () => clearInterval(intervalId);
  }, [isPolling, URL, API_KEY, navigate]);

  // Check if user is verified on page load
  useEffect(() => {
    const checkVerificationOnLoad = async () => {
      const user = auth.currentUser;
      // console.log("Checking verification on load...", user); // Debug log
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          // Add the user to the backend database
          console.log("User verified on load, adding to backend and redirecting..."); // Debug log
          await axios.post(`${URL}/users`, {
            email: user.email,
            firebaseAuthId: user.uid,
            isContestant: true,
          }, {
            headers: { Authorization: `${API_KEY}` },
          });

          // Redirect to login
          navigate("/contestant/login");
        }
      }
    };
    checkVerificationOnLoad();
  }, [URL, API_KEY, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main>
      <section>
        <div className="form-background">
          <div className="form-container">
            <h2>Contestant Sign Up</h2>
            <button onClick={handleGoogleSignIn} className="google-signin-button">
              Sign Up with Google
            </button>
            <p className="or-divider">
              <span>or</span>
            </p>
            <p className="form-description">If signing up with your own email, you will need to verify your email.</p>
            <form onSubmit={onSubmit} noValidate>
              {flashMessage.message && (
                <p className={`flash-message ${flashMessage.type}`}>
                  {flashMessage.message}
                </p>
              )}
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
                <span className="input-group--password-toggle" onClick={togglePasswordVisibility}>
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
                <span className="input-group--password-toggle" onClick={togglePasswordVisibility}>
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
              <button type="submit" disabled={isSubmitting} >Sign up</button>
            </form>
            <p className="login-redirect">
              Already have an account? <NavLink to="/login">Log in</NavLink>
            </p>
            {/* <div className="verify">
              <button className="resend-verification" onClick={handleResendVerification}>
                Resend verification email
              </button>
            </div> */}
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignUpContestant;
