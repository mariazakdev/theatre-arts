import React, { useState } from 'react';
import './LoginComponent.scss';

function LoginComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateForm()) {
      console.log('Form is valid!');
      // Here, you can trigger the login action or whatever you'd like to do on valid form submission.
    }
  };

  const validateForm = () => {
    let valid = true;
    let errors = { email: '', password: '' };

    if (!email) {
      valid = false;
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      valid = false;
      errors.email = 'Email address is invalid.';
    }

    if (!password) {
      valid = false;
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      valid = false;
      errors.password = 'Password must be at least 6 characters.';
    }

    setErrors(errors);
    return valid;
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
    <div className="form-group">
      <label className="label">Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`input ${errors.email ? 'input-error' : ''}`}
      />
      {errors.email && <div className="error-text">{errors.email}</div>}
    </div>
    <div className="form-group">
      <label className="label">Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={`input ${errors.password ? 'input-error' : ''}`}
      />
      {errors.password && <div className="error-text">{errors.password}</div>}
    </div>
    <button type="submit" className="button">Login</button>
  </form>
  
  );
}

export default LoginComponent;
