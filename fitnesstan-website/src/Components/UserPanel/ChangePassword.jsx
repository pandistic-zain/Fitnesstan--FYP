// src/components/ChangePassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader';
import styles from './ChangePassword.module.css';
import { changePassword } from '../../API/RegisterAPI'; // This function should call the PUT /user/change-password endpoint

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Check that new password and confirm password are identical
    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation do not match.');
      return;
    }

    setLoading(true);
    try {
      // Call the API to change the password (make sure it returns a success status if changed)
      await changePassword({ currentPassword, newPassword });
      setSuccessMessage('Password changed successfully.');
      // Clear form fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // Navigate back to dashboard after a short delay (e.g., 2 seconds)
      setTimeout(() => {
        navigate('/userdashboard');
      }, 2000);
    } catch (error) {
      // Display error response from backend if available, or a generic error message.
      const msg = error.response?.data || 'Failed to change password. Please try again.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.changePasswordContainer}>
      <h1 className={styles.pageTitle}>Change Password</h1>
      {loading && <Loader />}
      {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
      {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
      <form onSubmit={handleSubmit} className={styles.changePasswordForm}>
        <div className={styles.formGroup}>
          <label htmlFor="currentPassword">Current Password:</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={styles.inputField}
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
