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

console.log("REACT_APP_TEST:", process.env.REACT_APP_TEST);

console.log("REACT_APP_TEST_URL:", process.env.REACT_APP_URL);


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<PrivateRoute><DashBoard /></PrivateRoute>} />
            <Route path="/home" element={<HomePage />} />


            <Route path="voter/signup" element={<SignUpPage />} />
            <Route path="voter/login" element={<LoginPage />} />
            <Route path="voter/forgot-password" element={<ForgotPasswordPage />} />

            <Route path="/vote" element={<PrivateRoute><VotingPage /></PrivateRoute>} />
            {/* results of vote and body */}
            <Route path="voter/contestant" element={<PrivateRoute><VotingPage /></PrivateRoute>} />

            <Route path="/actors" element={<ActorsPage />} />

            {/* contestants */}
            <Route path="contestant/upload" element={<PrivateRoute><VideoUploadPage /></PrivateRoute>} />
            <Route path="contestant/update-profile" element={<PrivateRoute><UpdateProfilePage /></PrivateRoute>} />
            {/* catch-all */}
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}


export default App;
