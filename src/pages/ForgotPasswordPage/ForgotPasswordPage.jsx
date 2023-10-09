import React, { useState } from 'react';
import { useAuth } from "../../contexts/AuthContext"; 
import "./ForgotPasswordPage.scss"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { resetPassword } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await resetPassword(email); 
      setMessage('Check your inbox for further instructions.');
    } catch (err) {
      setError('Error resetting password: ' + err.message);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
        </div>
        
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
}
