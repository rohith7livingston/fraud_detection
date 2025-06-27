// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Centralized API functions
export const getTransactions = () => apiClient.get('/transactions');
export const getTransactionDetails = (id) => apiClient.get(`/transaction/${id}`);
export const processNewTransaction = (data) => apiClient.post('/process-transaction', data);
export const updateTransactionStatus = (id, status) => apiClient.post('/status', {
  transaction_id: id,
  new_status: status,
});