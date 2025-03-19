// src/components/EmailVerification.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyEmail, getFullUserData, resendOtp } from "../../API/RegisterAPI.jsx";
import Loader from "../Loader.jsx";
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

  // Utility: Clear messages after 5 seconds
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
    setLoading(true);

    try {
      // 1) Call the verifyEmail API
      const verifyResponse = await verifyEmail(email, otp);
      console.error("[DEBUG] verifyEmail response:", verifyResponse);
      
      // Check if the verifyResponse data contains a valid 'email' field
      if (!verifyResponse.data || !verifyResponse.data.email) {
        setErrorMessage(
          (verifyResponse.data && verifyResponse.data.message) ||
          "Invalid OTP. Please try again."
        );
        setLoading(false);
        return;
      }

      // If verification is successful, show a message
      setMessage("Email verified!");

      // 2) Fetch the full user data (expects an object: { user, diet, workoutPlan })
      const fullUserData = await getFullUserData();
      console.log("[DEBUG] FullUserInfoDTO:", fullUserData);
      if (fullUserData && fullUserData.user) {
        localStorage.setItem("userData", JSON.stringify(fullUserData.user));
      } else {
        console.error("Failed to fetch full user data:", fullUserData);
        setErrorMessage("Failed to fetch full user data.");
        clearMessagesAfterTimeout();
        setLoading(false);
        return;
      }

      // 3) Navigate to the dashboard after a short delay (1 second)
      setTimeout(() => navigate("/userdashboard"), 1000);
    } catch (error) {
      console.error("Verification error:", error.response?.data || error);
      setErrorMessage(
        error.response?.data?.message ||
        "Verification failed. Please try again."
      );
    } finally {
      setLoading(false);
      clearMessagesAfterTimeout();
    }
  };

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
    } catch (error) {
      console.error("Resend OTP error:", error.response?.data || error);
      setErrorMessage("Could not resend OTP. Try again later.");
      setIsCooldown(false);
      setCooldownTime(0);
    }
    clearMessagesAfterTimeout();
  };

  // Cooldown timer effect for Resend OTP
  useEffect(() => {
    if (isCooldown && cooldownTime > 0) {
      const timer = setInterval(() => {
        setCooldownTime(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (cooldownTime === 0) {
      setIsCooldown(false);
    }
  }, [isCooldown, cooldownTime]);

  // Debug logging
  console.log("EmailVerification component loaded");
  console.log("Email:", email);
  console.log("OTP:", otp);
  console.log("Message:", message);
  console.log("Error Message:", errorMessage);
  console.log("Is Cooldown:", isCooldown);
  console.log("Cooldown Time:", cooldownTime);
  console.log("Loading:", loading);

  return (
    <div className={styles.verificationContainer}>
      <div className={styles.card}>
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
          <button type="button" className={styles.action} onClick={handleVerify}>
            Verify OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
