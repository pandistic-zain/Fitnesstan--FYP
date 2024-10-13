import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyEmail } from "../../API/RegisterAPI.jsx"; // Import the API function to verify email
import styles from './EmailVerification.module.css'; // Import the CSS module

const EmailVerification = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    try {
      const response = await verifyEmail(email, otp);
      if (response.status === 200) {
        setMessage("Your email has been successfully verified! You can now log in to your account.");
        navigate("/user-dashboard"); 
      } else {
        setErrorMessage(response.data.message || "Verification failed. Please check your OTP and try again.");
      }
    } catch (error) {
      console.error("Verification error: ", error.response?.data || error);
      // Customize error messages based on the error response
      if (error.response?.status === 400) {
        setErrorMessage("Invalid OTP. Please make sure you've entered the correct code sent to your email.");
      } else if (error.response?.status === 404) {
        setErrorMessage("No user found with this email address. Please check and try again.");
      } else if (error.response?.status === 500) {
        setErrorMessage("Internal server error. Please try again later.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };
  return (
    <div className={styles.verificationContainer}>
      <div className={styles.formContainer}>
        <h2>Email Verification</h2>
        <form onSubmit={handleVerify}>
          <div className={styles.formGroup}>
            <label htmlFor="otp">OTP</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className={styles.formInput}
            />
          </div>
          <button type="submit" className={styles.submitButton}>Verify OTP</button>
        </form>
        {message && <p className={styles.successMessage}>{message}</p>}
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default EmailVerification;
