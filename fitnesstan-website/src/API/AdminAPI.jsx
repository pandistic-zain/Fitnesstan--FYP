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

// Deactivate (Delete) user with authentication
export const deactivateUser = async (userId) => {
  const token = getAuthHeader(); // Get the token for authorization
  try {
    console.log("Deactivating user with ID: ", userId); // Debug: log user ID
    
    
    console.log("Calling BackEnd API"); // Debug: log user ID

    // Sending a DELETE request to deactivate the user
    const response = await axios.delete(`${ADMIN_API_URL}/deactivate-user/${userId}`, {
      headers: {
        Authorization: token, // Authorization header with the token
        'Content-Type': 'application/json', // Ensure proper content type
      },
    });

    console.log("Response from deactivation: ", response.data); // Debug: log the response
    return response.data; // Return the response data after deactivation
  } catch (error) {
    console.error("Error deactivating user:", error); // Error logging
    throw error.response?.data || { message: "An error occurred while deactivating the user." };
  }
};

// Delete feedback by ID
export const deleteFeedback = async (feedbackId) => {
  const token = getAuthHeader();
  try {
    const response = await axios.delete(`${ADMIN_API_URL}/feedback/${feedbackId}`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data; // Return the response from the backend
  } catch (error) {
    throw error.response?.data || { message: "An error occurred while deleting the feedback." };
  }
};
