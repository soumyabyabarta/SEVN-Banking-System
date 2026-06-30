import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        // Any status code that lies within the range of 2xx causes this function to trigger
        return response;
    },
    (error) => {
        // Any status codes that falls outside the range of 2xx causes this function to trigger
        if (error.response) {
            // If we get a 401 Unauthorized from the backend (Token expired/blacklisted)
            if (error.response.status === 401) {
                const { logout } = useAuthStore.getState();
                
                // Only toast and logout if we are not already on the login page
                if (window.location.pathname !== '/login') {
                    toast.error('Session expired. Please login again.');
                    logout();
                    window.location.href = '/login'; // Force redirect to login
                }
            }
            
            // Global handling for 500 Server Errors
            if (error.response.status === 500) {
                toast.error('Server encountered an error. Please try again later.');
            }
        } else if (error.request) {
            // The request was made but no response was received (Network Error)
            toast.error('Network Error! Please check your connection.');
        }

        return Promise.reject(error);
    }
);

export default api;