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
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            <Route path="/profile" element={<PrivateRoute><UserPage /></PrivateRoute>} />
            <Route path="/actors" element={<ActorsPage />} />
            <Route path="/upload" element={<PrivateRoute><VideoUploadPage /></PrivateRoute>} />
            <Route path="/update-profile" element={<PrivateRoute><UpdateProfilePage /></PrivateRoute>} />
            {/* Catch-all route for 404 should be at the end */}
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}


export default App;
