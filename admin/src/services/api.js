var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/services/api.ts
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
// Create axios instance
const api = axios.create({
    baseURL: `${API_URL}`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});
// Request interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));
// Response interceptor
api.interceptors.response.use((response) => response, (error) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem('refreshToken');
    if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        refreshToken) {
        originalRequest._retry = true;
        try {
            const response = yield axios.post('http://your-api-url.com/api/auth/refresh', { refreshToken }, { withCredentials: true });
            const { accessToken } = response.data;
            localStorage.setItem('accessToken', accessToken);
            // Update headers
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            if (originalRequest.headers) {
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            return api(originalRequest);
        }
        catch (refreshError) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
}));
export default api;
