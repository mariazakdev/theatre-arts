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
import PaymentCompetitionPage from "./pages/PaymentCompetitionPage/PaymentCompetitionPage";
import PaymentSuccess from "./components/PaymentSuccess/PaymentSuccess";
import LoginVoterPage from "./pages/LoginVoterPage/LoginVoterPage";
import SignUpVoterPage from "./pages/SignUpVoterPage/SignUpVoterPage";
import PaymentContestantPage from "./pages/PaymentContestantPage/PaymentContestantPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import SunKingPage from "./pages/SunKingPage/SunKingPage";
import useAdminRouteAuthorization from "./hooks/useAdminRouteAuthorization";
import "./App.scss";

const URL = process.env.REACT_APP_BACKEND_URL;
const CLIENT_URL = process.env.REACT_APP_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

function App() {


  return (
    <AuthProvider>
      <StripeWrapper>
      <Router>
        <div className="App">
          <Header URL={URL} API_KEY={API_KEY}/>
          <Routes>

 {/* Render AdminRoute only if isAdmin is true */}
 {/* {isAdmin && (
              <Route exact path="/admin" element={<AdminPage URL={URL} CLIENT_URL={CLIENT_URL} API_KEY={API_KEY} />} />
            )} */}
            <Route exact path="/admin" element={<AdminPage URL={URL} CLIENT_URL={CLIENT_URL} API_KEY={API_KEY} />} />


            {/* Common Routes for All */}
            <Route exact path="/" element={<HomePage URL={URL} API_KEY={API_KEY}/>} />
            {/* Contestants only  */}
            <Route exact path="/contestant/signup" element={<SignUpPage URL={URL} CLIENT_URL={CLIENT_URL} API_KEY={API_KEY}  />} />
            <Route exact path="/contestant/login" element={<LoginPage URL={URL} CLIENT_URL={CLIENT_URL} API_KEY={API_KEY}  />} />
            {/* One time contestants only */}
            <Route
              exact path="/contestant/enter"
              element={
                <PrivateRoute>
                  <OneTimeUploadRoute URL={URL} CLIENT_URL={CLIENT_URL} API_KEY={API_KEY} >
                    <PaymentCompetitionPage URL={URL} CLIENT_URL={CLIENT_URL} API_KEY={API_KEY} />
                  </OneTimeUploadRoute >
                </PrivateRoute>
              }
            />
            <Route
              exact path="/contestant/upload"
              element={
                <PrivateRoute>
                  <OneTimeUploadRoute>
                    <VideoUploadPage URL={URL} CLIENT_URL={CLIENT_URL} API_KEY={API_KEY} />
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
                  <DashBoardPage URL={URL} CLIENT_URL={CLIENT_URL} API_KEY={API_KEY}  />
                </PrivateContestantRoute>
              }
            />
  

            <Route
              exact path="/contestant/payment-success"
              element={<PaymentContestantPage />}
            />
            {/* All visitors to site */}
            <Route exact path="/signup" element={<SignUpVoterPage URL={URL} CLIENT_URL={CLIENT_URL} API_KEY={API_KEY}  />} />
            <Route exact path="/login" element={<LoginVoterPage URL={URL} CLIENT_URL={CLIENT_URL} API_KEY={API_KEY} />} />
            <Route
              exact path="/contestant/forgot-password"
              element={<ForgotPasswordPage  />}
            />



            <Route exact path="/actors" element={<ActorsPage URL={URL} API_KEY={API_KEY} />} />





            <Route exact path="/actors/vote/:actorId" element={<VotingPage URL={URL} CLIENT_URL={CLIENT_URL} API_KEY={API_KEY} />} />


            <Route
              exact path="/actors/:actorId"
              element={<ContestantDetailPage URL={URL} CLIENT_URL={CLIENT_URL} API_KEY={API_KEY}  />}
            />

              

            <Route exact path="/payment-success" element={<PaymentSuccess URL={URL} CLIENT_URL={CLIENT_URL} API_KEY={API_KEY} />} />
            <Route exact path="/sun-king" element={<SunKingPage URL={URL} CLIENT_URL={CLIENT_URL} API_KEY={API_KEY} />} />

            {/* Catch-all */}
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </div>
        <Footer />
      </Router>
              </StripeWrapper>
    </AuthProvider>
  );
}
    

export default App;
