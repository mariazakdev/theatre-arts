 import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./components/Header/Header";
import HomePage from './pages/HomePage/HomePage';
import Footer from './components/Footer/Footer';
import VideoUploadPage from './pages/VideoUploadPage/VideoUploadPage';
import ActorsPage from './pages/ActorsPage/ActorsPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import UpdateProfilePage from './pages/UpdateProfilePage/UpdateProfilePage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage';
import VotingPage from './pages/VotingPage/VotingPage';
import StripeWrapper from './components/StripeWrapper/StripeWrapper';
import VoterDashboard from './pages/VoterDashboard/VoterDashboard';
import ContestantDetailPage from './pages/ContestantDetailPage/ContestantDetailPage';
import EnterCompetitionPage from './pages/EnterCompetitionPage/EnterCompetitionPage';
import PaymentSuccess from './components/PaymentSuccess/PaymentSuccess';
import LoginVoterPage from './pages/LoginVoterPage/LoginVoterPage';
import SignUpVoterPage from './pages/LoginVoterPage/LoginVoterPage';

import OneTimeUploadRoute from './components/OneTimeUploadRoute/OneTimeUploadRoute';


console.log("REACT_APP_TEST_URL:", process.env.REACT_APP_URL);
const URL=process.env.REACT_APP_BACKEND_URL;
console.log(URL);

function App() {
  return (
    <StripeWrapper>
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
    {/* Common Routes for All */}
    <Route path="/home" element={<HomePage />} />
    <Route path="/contestant/signup" element={<SignUpPage />} />
    <Route path="/signup" element={<SignUpVoterPage />} />

    <Route path="contestant/login" element={<LoginPage />} />
    <Route path="/login" element={<LoginVoterPage />} />

    <Route path="contestant/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/actors" element={<ActorsPage />} />
    <Route path="/actors/vote/:actorId" element={<VotingPage />} />
    <Route path="/actors/:actorId" element={<ContestantDetailPage />} />
    <Route path="/payment-success" element={<PaymentSuccess />} />

    {/* Routes for Contestants */}
    <Route path="/contestant/dashboard" element={<PrivateRoute><VoterDashboard backendURL={URL} /></PrivateRoute>} />

    <Route path="/contestant/upload" element={<OneTimeUploadRoute><VideoUploadPage backendURL={URL} /></OneTimeUploadRoute>} />

    <Route path="/contestant/enter" element={<PrivateRoute><EnterCompetitionPage backendURL={URL} /></PrivateRoute>} />
    <Route path="/contestant/update-profile" element={<PrivateRoute><UpdateProfilePage /></PrivateRoute>} />

    {/* Routes for Voters */}
    <Route path="/voter/dashboard" element={<PrivateRoute><VoterDashboard /></PrivateRoute>} />
    <Route path="/contestants/vote" element={<PrivateRoute><VotingPage /></PrivateRoute>} />

  

    {/* Catch-all */}

    <Route path="*" element={<div>404 Not Found</div>} />
</Routes>

        </div>
      </Router>
    </AuthProvider>
    </StripeWrapper>
  );
}


export default App;
