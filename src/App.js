import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./components/Header/Header";
import HomePage from './pages/HomePage/HomePage';
import Footer from './components/Footer/Footer';
import VideoUploadPage from './pages/VideoUploadPage/VideoUploadPage';
import UserPage from './pages/UserPage/UserPage';
import ActorsPage from './pages/ActorsPage/ActorsPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import DashBoard from './pages/DashBoard/DashBoard';
import UpdateProfilePage from './pages/UpdateProfilePage/UpdateProfilePage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage';
import VotingPage from './pages/VotingPage/VotingPage';
import StripeWrapper from './components/StripeWrapper/StripeWrapper';
import VoterDashboard from './pages/VoterDashboard/VoterDashboard';
import ContestantDetailPage from './pages/ContestantDetailPage/ContestantDetailPage';
import ContestantListPage from './pages/ContestantListPage/ContestantListPage';

console.log("REACT_APP_TEST:", process.env.REACT_APP_TEST);

console.log("REACT_APP_TEST_URL:", process.env.REACT_APP_URL);
const URL=process.env.REACT_APP_BACKEND_URL;

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
    <Route path="/signup" element={<SignUpPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />

    {/* Public Routes */}
    <Route path="/actors" element={<ActorsPage />} />

    {/* Routes for Contestants */}
    <Route path="/contestant/dashboard" element={<PrivateRoute><DashBoard /></PrivateRoute>} />
    <Route path="/contestant/upload" element={<PrivateRoute><VideoUploadPage backendURL={URL} /></PrivateRoute>} />
    <Route path="/contestant/update-profile" element={<PrivateRoute><UpdateProfilePage /></PrivateRoute>} />

    {/* Routes for Voters */}
    <Route path="/voter/dashboard" element={<PrivateRoute><VoterDashboard /></PrivateRoute>} />
    <Route path="/voter/vote" element={<PrivateRoute><VotingPage /></PrivateRoute>} />
    <Route path="/voter/contestants" element={<PrivateRoute><ContestantListPage /></PrivateRoute>} />
    <Route path="/voter/contestant/:id" element={<PrivateRoute><ContestantDetailPage /></PrivateRoute>} />

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
