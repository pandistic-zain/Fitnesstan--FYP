import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyEmail } from "../../API/RegisterAPI.jsx"; // API function to verify email
import styles from "./EmailVerification.module.css"; // Import CSS module

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
        setMessage("Email verified!");
        navigate("/user-dashboard");
      } else {
        setErrorMessage(response.data.message || "Invalid OTP. Try again.");
      }
    } catch (error) {
      console.error("Verification error: ", error.response?.data || error);
      if (error.response?.status === 400) {
        setErrorMessage("Invalid OTP. Please try again.");
      } else if (error.response?.status === 404) {
        setErrorMessage("Email not found. Check your entry.");
      } else if (error.response?.status === 500) {
        setErrorMessage("Server error. Please try later.");
      } else {
        setErrorMessage("An error occurred. Try again.");
      }
    }
  };

  const handleResendOtp = () => {
    setMessage("OTP has been resent.");
    setErrorMessage("");
  };

  return (
    <div className={styles.verificationContainer}>
      <div className={styles.card}>
        <div className={styles.header}></div>
        <div className={styles.info}>
          <p className={styles.title}>Verify Your Email</p>
          <h3>Thanks for choosing Fitnesstan! Enter the OTP sent to your email.</h3>
          <input
            type="text"
            className={styles.otpInput}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
          {message && <div className={styles.message}>{message}</div>}
          {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
        </div>
        <div className={styles.footer}>
          <p className={styles.resend} onClick={handleResendOtp}>Resend OTP</p>
          <button type="button" className={styles.action} onClick={handleVerify}>
            Verify OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
