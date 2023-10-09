import React, { useState } from 'react';
import { useAuth } from "../../contexts/AuthContext"; 
import { useNavigate } from 'react-router-dom';
import './UpdateProfilePage.scss';

export default function UpdateProfilePage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // New state variable
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { updateEmail, updatePassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        
        try {
            if (email) await updateEmail(email);
            if (password) await updatePassword(password);
            setMessage('Profile updated successfully.');
        } catch (err) {
            setError('Failed to update profile. ' + err.message);
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div className="update-profile-container">
            <h2>Update Profile</h2>

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">Email:</label>
                    <input 
                        type="email"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Leave blank to keep the same"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="password">New Password:</label>
                    <input 
                        type="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Leave blank to keep the same"
                    />
                </div>

                <div className="input-group">  {/* New input group for confirm password */}
                    <label htmlFor="confirmPassword">Confirm New Password:</label>
                    <input 
                        type="password"
                        id="confirmPassword"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat the new password"
                    />
                </div>

                <button type="submit">Update</button>
                <button type="button" onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    );
}
