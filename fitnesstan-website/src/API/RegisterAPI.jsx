// src/API/RegisterAPI.jsx
import axios from 'axios';

const API_URL = 'http://localhost:8080/register'; // Your Spring Boot backend URL

export const registerUser = async (userData) => {
    return await axios.post(`${API_URL}/create-user`, userData);
};

export const loginUser = async (userData) => {
    return await axios.post(`${API_URL}/login`, userData);
};
