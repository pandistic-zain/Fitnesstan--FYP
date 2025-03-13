// src/API/RegisterAPI.jsx
import axios from "axios";

// Global Axios defaults
axios.defaults.withCredentials = false;
axios.defaults.headers.post["Content-Type"] = "application/json";

// If you're using Basic Auth, add an interceptor to attach credentials on every request
axios.interceptors.request.use(
  (config) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    if (username && password) {
      // Basic auth header format: "Basic base64(username:password)"
      config.headers.Authorization = `Basic ${btoa(`${username}:${password}`)}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Base URLs for different endpoints
const API_URL = "http://localhost:8080/register"; // For register, login, verify, resend OTP
const USER_API_URL = "http://localhost:8080/user";  // For fetching user data

// Register a new user (required info)
export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/required-info`, userData, {
    headers: { "Content-Type": "application/json" },
  });
};

// Log in a user
export const loginUser = async (userData) => {
  return await axios.post(`${API_URL}/login`, userData);
};

// Verify a user's email using OTP
export const verifyEmail = async (email, otp) => {
  return await axios.get(`${API_URL}/verify-email`, {
    params: { email, otp },
  });
};

// Resend OTP to the given email
export const resendOtp = async (email) => {
  return await axios.post(`${API_URL}/resend-otp`, { email });
};

// Get full user data (user, diet, exercise info)
// This endpoint is protected; Basic Auth credentials are attached automatically.
export const getFullUserData = async () => {
  return await axios.get(`${USER_API_URL}/full`);
};
