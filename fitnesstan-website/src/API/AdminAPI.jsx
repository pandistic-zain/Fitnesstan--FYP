// src/API/AdminAPI.jsx
import axios from "axios";

const ADMIN_API_URL = "http://localhost:8080/admin";

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
    throw (
      error.response?.data || {
        message: "An error occurred while fetching users.",
      }
    );
  }
};

export const updateUser = async (userId, updatedUserData) => {
  const token = getAuthHeader();
  const response = await axios.put(
    `${ADMIN_API_URL}/update-user/${userId}`,
    updatedUserData,
    { headers: { Authorization: token } }
  );
  return response.data;
};


// Deactivate (Delete) user with authentication
export const deactivateUser = async (userId) => {
  const token = getAuthHeader();
  const url = `${ADMIN_API_URL}/deactivate-user/${userId}`;
  console.debug("→ DELETE", url);
  const response = await axios.delete(url, {
    headers: { Authorization: token },
  });
  console.debug("← status:", response.status, "data:", response.data);
  return response; // <-- return the whole response, not just response.data
};

// Delete feedback by ID
export const deleteFeedback = async (feedbackId) => {
  const token = getAuthHeader();
  try {
    const response = await axios.delete(
      `${ADMIN_API_URL}/feedback/${feedbackId}`,
      {
        headers: {
          Authorization: token,
        },
      }
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
