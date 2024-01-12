import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateContestantRoute from "./components/PrivateRoute/PrivateContestantRoute";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import OneTimeUploadRoute from "./components/OneTimeUploadRoute/OneTimeUploadRoute";

import Header from "./components/Header/Header";
import HomePage from "./pages/HomePage/HomePage";
import Footer from "./components/Footer/Footer";
import VideoUploadPage from "./pages/VideoUploadPage/VideoUploadPage";
import ActorsPage from "./pages/ActorsPage/ActorsPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import UpdateProfilePage from "./pages/UpdateProfilePage/UpdateProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage/ForgotPasswordPage";
import VotingPage from "./pages/VotingPage/VotingPage";
import StripeWrapper from "./components/StripeWrapper/StripeWrapper";
import DashBoardPage from "./pages/DashBoardPage/DashBoardPage";
import ContestantDetailPage from "./pages/ContestantDetailPage/ContestantDetailPage";
import EnterCompetitionPage from "./pages/EnterCompetitionPage/EnterCompetitionPage";
import PaymentSuccess from "./components/PaymentSuccess/PaymentSuccess";
import LoginVoterPage from "./pages/LoginVoterPage/LoginVoterPage";
import SignUpVoterPage from "./pages/SignUpVoterPage/SignUpVoterPage";
import PaymentContestPage from "./pages/PaymentContestPage/PaymentContestPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import SunKingPage from "./pages/SunKingPage/SunKingPage";


import "./App.scss";


console.log("REACT_APP_TEST_URL:", process.env.REACT_APP_URL);
const URL = process.env.REACT_APP_BACKEND_URL;
console.log(URL);

function App() {
  return (
    <StripeWrapper>
      <AuthProvider>
        <Router>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/admin" element={<AdminPage />} />
              {/* Common Routes for All */}
              <Route path="/" element={<HomePage />} />
              {/* Contestants only  */}
              <Route path="/contestant/signup" element={<SignUpPage />} />
              <Route path="contestant/login" element={<LoginPage />} />
              {/* One time contestants only */}
              <Route
                path="/contestant/enter"
                element={
                  <PrivateRoute>
                    <OneTimeUploadRoute>
                      <EnterCompetitionPage backendURL={URL} />
                    </OneTimeUploadRoute>
                  </PrivateRoute>
                }
              />
              <Route
                path="/contestant/upload"
                element={
                  <PrivateRoute>
                    <OneTimeUploadRoute>
                      <VideoUploadPage backendURL={URL} />
                    </OneTimeUploadRoute>
                  </PrivateRoute>
                }
              />
              {/* One contestant */}
             {/* Private route for contestant dashboard */}
             <Route
                                path="/contestant/dashboard"
                                element={
                                    <PrivateContestantRoute>
                                        <DashBoardPage backendURL={URL} />
                                     </PrivateContestantRoute>
                                }
                            />
              <Route
                path="/contestant/payment-success"
                element={<PaymentContestPage />}
              />
              {/* All visitors to site */}
              <Route path="/signup" element={<SignUpVoterPage />} />
              <Route path="/login" element={<LoginVoterPage />} />
              <Route
                path="contestant/forgot-password"
                element={<ForgotPasswordPage />}
              />
              <Route path="/actors" element={<ActorsPage />} />
              <Route path="/actors/vote/:actorId" element={<VotingPage />} />
              <Route
                path="/actors/:actorId"
                element={<ContestantDetailPage />}
              />
              <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/sun-king" element={<SunKingPage/>} />

            
              {/* Catch-all */}
              <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </AuthProvider>
    </StripeWrapper>
  );
}

export default App;
