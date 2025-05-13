// src/API/AdminAPI.jsx
import axios from "axios";

const ADMIN_API_URL = "http://localhost:8080/admin";

axios.interceptors.request.use(
  (config) => {
    if (config.url.startsWith(ADMIN_API_URL)) {
      const username = localStorage.getItem("username");
      const password = localStorage.getItem("password");
      if (username && password) {
        config.headers.Authorization = `Basic ${btoa(
          `${username}:${password}`
        )}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fetch all users with authentication
export const fetchAllUsers = async () => {
  try {
    const response = await axios.get(`${ADMIN_API_URL}/all-users`);
    return response.data; // Return the response data for use in your component
  } catch (error) {
    throw (
      error.response?.data || {
        message: "An error occurred while fetching users.",
      }
    );
  }
};

export const updateUser = async (userId, updatedUserData) => {
  const response = await axios.put(
    `${ADMIN_API_URL}/update-user/${userId}`,
    updatedUserData
  );
  return response.data;
};

// Deactivate (Delete) user with authentication
export const deactivateUser = async (userId) => {
  const url = `${ADMIN_API_URL}/deactivate-user/${userId}`;
  console.debug("→ DELETE", url);
  const response = await axios.delete(url);
  console.debug("← status:", response.status, "data:", response.data);
  return response; // <-- return the whole response, not just response.data
};

// Delete feedback by ID
export const deleteFeedback = async (feedbackId) => {
  try {
    const response = await axios.delete(
      `${ADMIN_API_URL}/feedback/${feedbackId}`
    );
    return response.data; // Return the response from the backend
  } catch (error) {
    throw (
      error.response?.data || {
        message: "An error occurred while deleting the feedback.",
      }
    );
  }
};
