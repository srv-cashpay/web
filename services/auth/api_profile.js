import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'https://103.127.134.78:2356/api'; // Pastikan base URL sesuai

// Helper function to get the token from cookies
const getTokenFromCookie = () => Cookies.get('token');
const getRefreshTokenFromCookie = () => Cookies.get('refresh_token');

// Fungsi untuk merefresh token
const refreshAuthToken = async () => {
    const refreshToken = getRefreshTokenFromCookie(); 
    if (!refreshToken) throw new Error('No refresh token available');

    try {
        const response = await axios.post(
            'https://103.127.134.78:2356/api/auth/refresh',
            { refresh_token: refreshToken },
            {
                headers: {
                    'x-api-key': '3f=Pr#g1@RU-nw=30', // Header tambahan jika diperlukan
                    'Authorization': `Bearer ${refreshToken}`
                },
            }
        );

        if (response.data && response.data.data.access_token) {
            const newToken = response.data.data.access_token;
            Cookies.set('token', newToken); // Store new token in cookies
            return newToken; // Return the new token
        } else {
            throw new Error('Invalid response structure');
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
};

// Create an axios instance with interceptors
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getTokenFromCookie();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            console.warn('Token expired. Attempting to refresh...');
            try {
                const newToken = await refreshAuthToken();
                // Add the new token to the failed request's headers
                error.config.headers.Authorization = `Bearer ${newToken}`;
                // Retry the failed request
                return axiosInstance.request(error.config);
            } catch (refreshError) {
                console.error('Failed to refresh token:', refreshError);
                window.location.href = '/accounts/tap/login '; // Redirect to login if refresh fails
                throw refreshError;
            }
        }
        return Promise.reject(error);
    }
);

// Exporting reusable API functions
export const fetchProfileData = async () => {
    try {
        const response = await axiosInstance.get('/auth/profile');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching profile data:', error);
        throw error;
    }
};

export const updateProfile = async (id, field, value) => {
    try {
        const response = await axiosInstance.put(`/auth/profile/update?id=${id}`, {
            [field]: value,
        });
        return response.data.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};
