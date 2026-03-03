import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Laravel default
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // For Sanctum cookie-based auth if needed, or Bearer token
});

// Interceptor to add Bearer token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
