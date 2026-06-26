import axios from 'axios';

// Get API URL from env, or default to relative /api (handled by Netlify redirects) or localhost
const apiURL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5001/api');

const axiosInstance = axios.create({
  baseURL: apiURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper for upload URLs
export const getUploadUrl = (filename) => {
  const uploadURL = import.meta.env.VITE_UPLOAD_URL || (import.meta.env.PROD ? '/uploads' : 'http://localhost:5001/uploads');
  return `${uploadURL}/${filename}`;
};

// Request Interceptor (to inject token)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
