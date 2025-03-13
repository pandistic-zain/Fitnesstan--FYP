// src/API/RegisterAPI.jsx
import axios from "axios";

// Global Axios defaults
axios.defaults.withCredentials = false;
axios.defaults.headers.post["Content-Type"] = "application/json";

// Base URLs for different endpoints
const API_URL = "http://localhost:8080/register"; // For register, login, verify, resend OTP
const USER_API_URL = "http://localhost:8080/user";  // For fetching user data

export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/required-info`, userData, {
    headers: { "Content-Type": "application/json" },
  });
};

export const loginUser = async (userData) => {
  return await axios.post(`${API_URL}/login`, userData);
};

export const verifyEmail = async (email, otp) => {
  return await axios.get(`${API_URL}/verify-email`, {
    params: { email, otp },
  });
};

export const resendOtp = async (email) => {
  return await axios.post(`${API_URL}/resend-otp`, { email });
};

// New API: Get full user data (user, diet, exercise info)
export const getFullUserData = async (email) => {
  return await axios.get(`${USER_API_URL}/full/${email}`);
};
