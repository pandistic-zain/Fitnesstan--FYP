// src/components/ForgotPassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader';
import styles from '../UserPanel/ChangePassword.module.css';
import { requestPasswordReset } from '../../API/RegisterAPI';

const ForgotPassword = () => {
  const [email, setEmail]               = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading]           = useState(false);
  const navigate                        = useNavigate();

  // clear messages after 5s
  const clearMessagesAfterTimeout = () => {
    setTimeout(() => {
      setErrorMessage('');
      setSuccessMessage('');
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your email.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await requestPasswordReset({ email });
      if (response.status === 200) {
        setSuccessMessage('OTP sent! Please check your email.');
        // now redirect to your OTP‐entry page, e.g.:
        setTimeout(() => navigate(`/resetpassword?email=${encodeURIComponent(email)}`), 1500);
      } else {
        setErrorMessage(response.data?.message || 'Failed to send OTP.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
      clearMessagesAfterTimeout();
    }
  };

  return (
    <div className={styles.changePasswordContainer}>
      <div className={styles.changePasswordCard}>
        <div className={styles.header}></div>
        {loading && <Loader />}
        <div className={styles.logoWrapper}></div>
        <h1 className={styles.title}>Forgot Password</h1>
        <p className={styles.subtitle}>
          Enter your email below and we'll send you an OTP to reset your password.
        </p>
        <form onSubmit={handleSubmit} className={styles.formGroup}>
          <input
            type="email"
            placeholder="Your Email Address"
            className={styles.inputField}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
          {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
          <button type="submit" className={styles.submitButton}>
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
