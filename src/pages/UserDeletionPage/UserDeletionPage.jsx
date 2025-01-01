import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext'; 
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { deleteUser } from "firebase/auth";
import './UserDeletionPage.scss';

const UserDeletionPage = ({ URL, API_KEY }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { currentUser } = useAuth();


  //   if (!email) {
  //     setError('Please enter your email address.');
  //     return;
  //   }

  //   if (currentUser && currentUser.email !== email) {
  //     setError('The email address does not match the logged-in user.');
  //     return;
  //   }

  //   const confirmation = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");

  //   if (!confirmation) {
  //     return;
  //   }

  //   try {
  //     await axios.delete(
  //       `${URL}/users/${currentUser.uid}`,
  //       {
  //         headers: { Authorization: `${API_KEY}` },
  //       }
  //     );
  //     await deleteUser(currentUser);
  //     setMessage('Your data has been deleted successfully.');
  //   } catch (error) {
  //     console.error('Error during data deletion request:', error);
  //     setError('Failed to submit your request. Please try again later.');
  //   }
  // };
  // const handleDeleteRequest = async (e) => {
  //   e.preventDefault();
  //   setMessage('');
  //   setError('');
  
  //   if (!email) {
  //     setError('Please enter your email address.');
  //     return;
  //   }
  
  //   if (currentUser && currentUser.email !== email) {
  //     setError('The email address does not match the logged-in user.');
  //     return;
  //   }
  
  //   const confirmation = window.confirm(
  //     "Are you sure you want to delete your account? This action cannot be undone."
  //   );
  
  //   if (!confirmation) {
  //     return;
  //   }
  
  //   try {
  //     // Attempt to delete from backend
  //     try {
  //       await axios.delete(
  //         `${URL}/users/${currentUser.uid}`,
  //         {
  //           headers: { Authorization: `${API_KEY}` },
  //         }
  //       );
  //       console.log("User deleted from backend.");
  //     } catch (backendError) {
  //       if (backendError.response && backendError.response.status === 404) {
  //         console.warn("User not found in backend, proceeding with Firebase deletion.");
  //       } else {
  //         throw backendError; // Rethrow other errors
  //       }
  //     }
  
  //     // Delete from Firebase
  //     await deleteUser(currentUser);
  //     setMessage('Your data has been deleted successfully.');
  //   } catch (error) {
  //     console.error('Error during data deletion request:', error);
  //     setError('Failed to submit your request. Please try again later.');
  //   }
  // };

const handleDeleteRequest = async (e) => {
  e.preventDefault();
  setMessage('');
  setError('');


  if (!currentUser) {
    console.error('Error: User not logged in.');
    setError('You must be logged in to delete your account. Please log in and try again.');
    return;
  }
  
  if (!email) {
    setError('Please enter your email address.');
    return;
  }

  if (currentUser && currentUser.email !== email) {
    setError('The email address does not match the logged-in user.');
    return;
  }

  const confirmation = window.confirm(
    "Are you sure you want to delete your account? This action cannot be undone."
  );

  if (!confirmation) {
    return;
  }

  try {
    // Attempt to delete from backend
    try {
      await axios.delete(
        `${URL}/users/${currentUser.uid}`,
        {
          headers: { Authorization: `${API_KEY}` },
        }
      );
      console.log("User deleted from backend.");
    } catch (backendError) {
      if (backendError.response && backendError.response.status === 404) {
        console.warn("User not found in backend, proceeding with Firebase deletion.");
      } else {
        throw backendError; // Rethrow other errors
      }
    }

    // Reauthenticate the user
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      prompt("Please enter your password to confirm your identity:")
    );

    await reauthenticateWithCredential(currentUser, credential);
    console.log("User reauthenticated.");

    // Delete from Firebase
    await deleteUser(currentUser);
    setMessage('Your data has been deleted successfully.');
  } catch (error) {
    console.error('Error during data deletion request:', error);

    if (error.code === 'auth/requires-recent-login') {
      setError('Your session has expired. Please log out and log in again before retrying.');
    } else {
      setError('Failed to submit your request. Please try again later.');
    }
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
          {!message && (
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
          )}
          {!message && <button type="submit">Submit Request</button>}
        </form>
      </section>
    </main>
  );
};

export default UserDeletionPage;
