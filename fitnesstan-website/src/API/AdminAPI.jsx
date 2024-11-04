// src/API/AdminAPI.jsx
import axios from 'axios';

const ADMIN_API_URL = 'http://localhost:8080/admin'; // Base URL for admin endpoints

export const fetchAllUsers = async () => {
  return await axios.get(`${ADMIN_API_URL}/all-users`);
};

export const updateUser = async (userId, updatedUserData) => {
  return await axios.put(`${ADMIN_API_URL}/update-user/${userId}`, updatedUserData);
};

export const deleteUser = async (userId) => {
  return await axios.delete(`${ADMIN_API_URL}/delete-user/${userId}`);
};
