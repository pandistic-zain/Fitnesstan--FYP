// src/components/ChangePassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader';
import styles from './ChangePassword.module.css';
import { changePassword } from '../../API/RegisterAPI';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Utility to clear messages after 5 seconds
  const clearMessagesAfterTimeout = () => {
    setTimeout(() => {
      setErrorMessage('');
      setSuccessMessage('');
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation do not match.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Call the changePassword API function (ensure it points to /user/change-password endpoint)
      const response = await changePassword({ 
        currentPassword, 
        newPassword 
      });
      
      if (response.status === 200) {
        setSuccessMessage('Password changed successfully.');
        setTimeout(() => {
          navigate('/userdashboard');
        }, 2000);
      } else {
        setErrorMessage(response.data?.message || 'Failed to change password.');
      }
    } catch (error) {
      console.error("Change password error:", error.response?.data || error);
      setErrorMessage(error.response?.data?.message || 'Failed to change password.');
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
        <div className={styles.logoWrapper}>
          {/* You can add a logo image here if desired */}
        </div>
        <h1 className={styles.title}>Change Password</h1>
        <p className={styles.subtitle}>
          Please enter your current password and choose a new password.
        </p>
        <form onSubmit={handleSubmit} className={styles.formGroup}>
          <input
            type="password"
            placeholder="Current Password"
            className={styles.inputField}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            className={styles.inputField}
            value={newPassword}
            minLength={6}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className={styles.inputField}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
          {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
          <button type="submit" className={styles.submitButton}>
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
