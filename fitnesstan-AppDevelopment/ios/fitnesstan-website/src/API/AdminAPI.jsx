// src/API/AdminAPI.jsx
import axios from 'axios';

const ADMIN_API_URL = 'http://localhost:8080/admin';

// Helper to get the auth header
const getAuthHeader = () => {
  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");
  const base64Credentials = btoa(`${email}:${password}`);
  return `Basic ${base64Credentials}`;
};

// Fetch all users with authentication
export const fetchAllUsers = async () => {
  const token = getAuthHeader();
  try {
    const response = await axios.get(`${ADMIN_API_URL}/all-users`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data; // Return the data for use in your component
  } catch (error) {
    // Handle error here
    throw error.response?.data || { message: "An error occurred while fetching users." };
  }
};

// Update user with authentication
export const updateUser = async (userId, updatedUserData) => {
  const token = getAuthHeader();
  try {
    const response = await axios.put(`${ADMIN_API_URL}/update-user/${userId}`, updatedUserData, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred while updating the user." };
  }
};

// Delete user with authentication
export const deleteUser = async (userId) => {
  const token = getAuthHeader();
  try {
    const response = await axios.delete(`${ADMIN_API_URL}/delete-user/${userId}`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred while deleting the user." };
  }
};
