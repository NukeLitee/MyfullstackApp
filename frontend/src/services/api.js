// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // URL gốc của API
});

// Sử dụng interceptor để tự động thêm token vào mỗi request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;