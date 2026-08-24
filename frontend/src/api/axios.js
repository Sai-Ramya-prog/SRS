import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 120000, // 2 minutes for batch calls
});

export default api;
