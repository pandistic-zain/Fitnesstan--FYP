// src/components/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '../Loader';
import styles from '../UserPanel/ChangePassword.module.css';  // same CSS module
import { resetPassword } from '../../API/RegisterAPI';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // grab email from query params after forgot-password redirected
  const params = new URLSearchParams(location.search);
  const email = params.get('email') || '';

  const [otp, setOtp]                     = useState('');
  const [newPassword, setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage]   = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading]             = useState(false);

  // clear messages after 5s
  const clearMessagesAfterTimeout = () => {
    setTimeout(() => {
      setErrorMessage('');
      setSuccessMessage('');
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!otp.trim()) {
      setErrorMessage('Please enter the OTP.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword({ email, otp, newPassword });
      if (response.status === 200) {
        setSuccessMessage('Password reset successfully!');
        // redirect back to login after a pause
        setTimeout(() => navigate('/register'), 1500);
      } else {
        setErrorMessage(response.data?.message || 'Failed to reset password.');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setErrorMessage(err.response?.data || 'Failed to reset password.');
    } finally {
      setLoading(false);
      clearMessagesAfterTimeout();
    }
  };

  // redirect back if we don't have an email
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password', { replace: true });
    }
  }, [email, navigate]);
return (
  <div className={styles.changePasswordContainer}>
    <div className={styles.changePasswordCard}>
      <div className={styles.header}></div>
      {loading && <Loader />}
      <div className={styles.logoWrapper}></div>
      <h1 className={styles.title}>Reset Password</h1>
      <p className={styles.subtitle}>
        Enter the OTP you received and choose a new password.
      </p>
      <form
        onSubmit={handleSubmit}
        className={styles.formGroup}
        autoComplete="off"
      >
        <input
          type="text"
          name="otp"
          placeholder="OTP"
          className={styles.inputField}
          value={otp}
          onChange={e => setOtp(e.target.value)}
          required
          autoComplete="off"
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          className={styles.inputField}
          value={newPassword}
          minLength={6}
          onChange={e => setNewPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          className={styles.inputField}
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
        <button type="submit" className={styles.submitButton}>
          Reset Password
        </button>
      </form>
    </div>
  </div>
);

};

export default ResetPassword;
