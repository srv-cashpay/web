import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://192.168.14.248:2358/api/merchant';

const getTokenFromCookie = () => Cookies.get('token');

// Fungsi untuk merefresh token
const refreshAuthToken = async () => {
    const refreshToken = Cookies.get('refresh_token'); // Ambil refresh token dari cookie
    if (!refreshToken) throw new Error('No refresh token available');

    try {
        const response = await axios.post(
            'http://192.168.14.248:2356/api/auth/refresh',
            { refresh_token: refreshToken },
            {
                headers: {
                    'x-api-key': '3f=Pr#g1@RU-nw=30', // Header tambahan jika diperlukan
                },
            }
        );

        if (response.data && response.data.data.access_token) {
            const newToken = response.data.data.access_token;
            Cookies.set('token', newToken); // Simpan token baru di cookie
            return newToken; // Kembalikan token baru
        } else {
            throw new Error('Invalid response structure');
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
};

// Buat instance axios dengan interceptor
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor untuk menyisipkan token pada setiap request
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

// Interceptor untuk menangani error pada respons
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            console.warn('Token expired. Attempting to refresh...');
            try {
                const newToken = await refreshAuthToken();
                // Set ulang token ke header dari request yang gagal
                error.config.headers.Authorization = `Bearer ${newToken}`;
                // Ulangi request asli
                return axiosInstance.request(error.config);
            } catch (refreshError) {
                console.error('Failed to refresh token:', refreshError);
                window.location.href = '/login'; // Redirect ke login jika refresh token gagal
                throw refreshError;
            }
        }
        return Promise.reject(error);
    }
);

// Fetch merchant data
export const fetchMerchantData = async () => {
    try {
        const response = await axiosInstance.get('/get');
        return response.data;
    } catch (error) {
        console.error('Error fetching merchant data:', error);
        throw error;
    }
};

// Update merchant data
export const updateMerchantData = async (merchantData) => {
    try {
        const response = await axiosInstance.put(`/update?id=${merchantData.id}`, merchantData);
        return response.data;
    } catch (error) {
        console.error('Error updating merchant data:', error);
        throw error;
    }
};

// Tambah user kasir
export const addCashier = async (cashierData) => {
    try {
        const response = await axiosInstance.post('/auth/signup', cashierData);
        return response.data;
    } catch (error) {
        console.error('Error adding cashier:', error);
        throw error;
    }
};

// Generate Authenticator QR Code
export const generateAuthenticatorCode = (merchantName) => {
    const secret = Math.random().toString(36).substring(2, 15); // Random secret
    return `otpauth://totp/${merchantName}?secret=${secret}&issuer=YourApp`;
};
