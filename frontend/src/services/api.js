import axios from 'axios';

const API_URL = 'https://sevn-banking-app.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response;
};

export const loginUser = async (userData) => {
  const response = await api.post('/auth/login', userData);
  return response;
};

export const logoutUser = async () => {
  const response = await api.post('/auth/logout');
  return response;
};

// ==========================================
// ACCOUNT ENDPOINTS
// ==========================================

export const getAccounts = async () => {
  const response = await api.get('/accounts'); 
  return response.data;
};

export const getBalance = async () => {
  const response = await api.get('/accounts'); 
  return response.data;
};

// ==========================================
// TRANSACTION ENDPOINTS
// ==========================================

export const getHistory = async () => {
  const response = await api.get('/transactions/history');
  return response.data;
};

export const transferMoney = async (receiverEmail, amount) => {
  const response = await api.post('/transactions/transfer', { 
    receiverEmail, 
    amount 
  });
  return response.data;
};

export default api;