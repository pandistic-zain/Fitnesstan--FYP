import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyEmail } from "../../API/RegisterAPI.jsx"; // Import the API function to verify email

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
        let data = response.data;

      if (response.status === 200) {
        // Assuming data contains user roles
        if (data.roles.includes("ADMIN")) {
          navigate("/AdminDashboard"); 
        } else {
          navigate("/user-dashboard"); 
        }
      } else {
          setErrorMessage(response.data.message || "Verification failed. Please try again.");
        }
      } catch (error) {
        console.error("Verification error: ", error.response?.data || error);
        setErrorMessage(error.response?.data.message || "An error occurred. Please try again.");
      }
    };
  
  return (
    <div className="verification-container">
      <h2>Email Verification</h2>
      <form onSubmit={handleVerify}>
        {/* Removed email input field */}
        <div className="form-group">
          <label>OTP</label>
          <input 
            type="text" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Verify OTP</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default EmailVerification;
