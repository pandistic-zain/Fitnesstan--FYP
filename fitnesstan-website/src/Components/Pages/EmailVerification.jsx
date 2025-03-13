// src/components/EmailVerification.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyEmail, getFullUserData, resendOtp } from "../../API/RegisterAPI.jsx";
import Loader from "../Loader.jsx"; // Ensure this is the correct path to your Loader component
import styles from "./EmailVerification.module.css";

const EmailVerification = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isCooldown, setIsCooldown] = useState(true);
  const [cooldownTime, setCooldownTime] = useState(60);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

  // Clear messages after 5 seconds
  const clearMessagesAfterTimeout = () => {
    setTimeout(() => {
      setMessage("");
      setErrorMessage("");
    }, 5000);
  };

  // Verify OTP function with loader
  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");
    setLoading(true); // Start loader

    try {
      const response = await verifyEmail(email, otp);
      if (response.status === 200) {
        setMessage("Email verified!");
        setErrorMessage("");
  
        // Call the API to get full user data
        const fullResponse = await getFullUserData(email);
        if (fullResponse.status === 200) {
          // Store the full user object in localStorage
          localStorage.setItem("userData", JSON.stringify(fullResponse.data.user));
        }
        // Navigate to dashboard after a short delay (1 second here)
        setTimeout(() => navigate("/userdashboard"), 1000);
      } else {
        setErrorMessage(response.data.message || "Invalid OTP. Try again.");
        setMessage("");
      }
      clearMessagesAfterTimeout();
    } catch (error) {
      console.error("Verification error: ", error.response?.data || error);
      setErrorMessage(
        error.response?.status === 400
          ? "Invalid OTP. Please try again."
          : error.response?.status === 404
          ? "Email not found. Check your entry."
          : error.response?.status === 500
          ? "Server error. Please try later."
          : "An error occurred. Try again."
      );
      setMessage("");
      clearMessagesAfterTimeout();
    } finally {
      setLoading(false);
    }
  };console.log("EmailVerification component loaded");
console.log("Email:", email);
console.log("OTP:", otp);
console.log("Message:", message);
console.log("Error Message:", errorMessage);
console.log("Is Cooldown:", isCooldown);
console.log("Cooldown Time:", cooldownTime);
console.log("Loading:", loading);

  // Resend OTP function with cooldown
  const handleResendOtp = async () => {
    setIsCooldown(true);
    setCooldownTime(60);
    setMessage("");
    setErrorMessage("");

    try {
      setMessage("Resending OTP...");
      await resendOtp(email);
      setMessage("OTP has been resent. Please check your email.");
      setErrorMessage("");
    } catch (error) {
      console.error("Resend OTP error: ", error.response?.data || error);
      setErrorMessage("Could not resend OTP. Try again later.");
      setMessage("");
      setIsCooldown(false);
      setCooldownTime(0);
    }
    clearMessagesAfterTimeout();
  };

  // Cooldown timer effect
  useEffect(() => {
    if (isCooldown && cooldownTime > 0) {
      const timer = setInterval(() => {
        setCooldownTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (cooldownTime === 0) {
      setIsCooldown(false);
    }
  }, [isCooldown, cooldownTime]);

  return (
    <div className={styles.verificationContainer}>
      <div className={styles.card}>
        {/* Optionally, show Loader as an overlay on the card */}
        {loading && <Loader />}

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
          <p
            className={`${styles.resend} ${isCooldown ? styles.disabled : ""}`}
            onClick={!isCooldown ? handleResendOtp : null}
          >
            {isCooldown ? `Resend OTP in ${cooldownTime}s` : "Resend OTP"}
          </p>
          <button
            type="button"
            className={styles.action}
            onClick={handleVerify}
          >
            Verify OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
