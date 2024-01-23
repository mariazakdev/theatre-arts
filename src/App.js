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

const URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route exact path="/admin" element={<AdminPage />} />
            {/* Common Routes for All */}
            <Route exact path="/" element={<HomePage />} />
            {/* Contestants only  */}
            <Route exact path="/contestant/signup" element={<SignUpPage />} />
            <Route exact path="/contestant/login" element={<LoginPage />} />
            {/* One time contestants only */}
            <Route
              exact path="/contestant/enter"
              element={
                <PrivateRoute>
                  <OneTimeUploadRoute>
                    <EnterCompetitionPage backendURL={URL} />
                  </OneTimeUploadRoute>
                </PrivateRoute>
              }
            />
            <Route
              exact path="/contestant/upload"
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
              exact path="/contestant/dashboard"
              element={
                <PrivateContestantRoute>
                  <DashBoardPage backendURL={URL} />
                </PrivateContestantRoute>
              }
            />
            <Route
              exact path="/contestant/payment-success"
              element={<PaymentContestPage />}
            />
            {/* All visitors to site */}
            <Route exact path="/signup" element={<SignUpVoterPage />} />
            <Route exact path="/login" element={<LoginVoterPage />} />
            <Route
              exact path="/contestant/forgot-password"
              element={<ForgotPasswordPage />}
            />
            <Route exact path="/actors" element={<ActorsPage />} />
            <Route exact path="/actors/vote/:actorId" element={<VotingPage />} />
            <Route
              exact path="/actors/:actorId"
              element={<ContestantDetailPage />}
            />
            <Route exact path="/payment-success" element={<PaymentSuccess />} />
            <Route exact path="/sun-king" element={<SunKingPage />} />

            {/* Catch-all */}
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
}
    

export default App;
