import axios from 'axios';
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'https://my-social-network-wine.vercel.app' });
API.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default API;
