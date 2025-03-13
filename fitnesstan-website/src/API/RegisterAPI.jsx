// src/API/RegisterAPI.jsx
import axios from "axios";

// Global Axios defaults
axios.defaults.withCredentials = false;
axios.defaults.headers.post["Content-Type"] = "application/json";

const API_URL = "http://localhost:8080/register"; // Your Spring Boot backend URL

export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/required-info`, userData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};


export const loginUser = async (userData) => {
  // Returns { userData } object on success
  return await axios.post(`${API_URL}/login`, userData);
};

// Additional endpoints if needed
export const verifyEmail = async (email, otp) => {
  return await axios.get(`${API_URL}/verify-email`, {
    params: { email, otp },
  });
};

export const resendOtp = async (email) => {
  return await axios.post(`${API_URL}/resend-otp`, { email });
};
