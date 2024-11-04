// src/API/AdminAPI.jsx
import axios from 'axios';

const ADMIN_API_URL = 'http://localhost:8080/admin'; // Base URL for admin endpoints

// Function to get the authentication token from local storage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Fetch all users with authentication
export const fetchAllUsers = async () => {
  const token = getAuthToken();
  return await axios.get(`${ADMIN_API_URL}/all-users`, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
};

// Update user with authentication
export const updateUser = async (userId, updatedUserData) => {
  const token = getAuthToken();
  return await axios.put(`${ADMIN_API_URL}/update-user/${userId}`, updatedUserData, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
};

// Delete user with authentication
export const deleteUser = async (userId) => {
  const token = getAuthToken();
  return await axios.delete(`${ADMIN_API_URL}/delete-user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
};
