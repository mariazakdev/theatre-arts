import React, { useState } from 'react';
import axios from 'axios';
import './UserDeletionPage.scss';

const UserDeletionPage = ({ URL, API_KEY }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleDeleteRequest = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      await axios.post(
        `${URL}/users/delete-request`,
        { email },
        {
          headers: { Authorization: `${API_KEY}` },
        }
      );
      setMessage('Your request has been submitted successfully.');
    } catch (error) {
      console.error('Error during data deletion request:', error);
      setError('Failed to submit your request. Please try again later.');
    }
  };

  return (
    <main className="data-deletion">
      <section className="container">
        <h1>Data Deletion Request</h1>
        <p>If you wish to delete your data from our application, please provide your email address below and submit your request. We will process your request as soon as possible.</p>
        
        <form onSubmit={handleDeleteRequest}>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          <div className="input-group">
            <label htmlFor="email-address">Email address</label>
            <input
              type="email"
              id="email-address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
            />
          </div>
          <button type="submit">Submit Request</button>
        </form>
      </section>
    </main>
  );
};

export default UserDeletionPage ;
