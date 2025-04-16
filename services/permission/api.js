import axios from 'axios';
import Cookies from 'js-cookie';

// Membuat instance Axios
const axiosInstance = axios.create({
    baseURL: 'https://103.127.134.78:2358/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Fungsi untuk mendapatkan token dari cookies
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
            Cookies.set('token', newToken); // Simpan token baru di cookies
            return newToken; // Kembalikan token baru
        } else {
            throw new Error('Invalid response structure');
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
};


// Interceptor untuk menambahkan token ke setiap request
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = getTokenFromCookie();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor untuk menangani error respons
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            console.warn('Token expired. Attempting to refresh...');
            try {
                const newToken = await refreshAuthToken();
                error.config.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance.request(error.config); // Retry original request
            } catch (refreshError) {
                console.error('Failed to refresh token:', refreshError);
                window.location.href = '/accounts/tap/login'; // Redirect ke login jika refresh token gagal
                throw refreshError;
            }
        }
        return Promise.reject(error);
    }
);

export const fetchPermissions = async (paginationData) => {
    try {
        const response = await axiosInstance.get('/merchant/permission/pagination', {
            params: paginationData,
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching permissions:', error);
        throw error;
    }
};

// Fungsi untuk membuat produk baru
export const createPermission = async (permission) => {
    try {
        const response = await axiosInstance.post('/merchant/permission/create', permission);
        return response.data; // Respons data
    } catch (error) {
        console.error('Error creating permission:', error);
        throw error;
    }
};

// Fungsi untuk menghapus produk berdasarkan ID
export const deletePermission = async (id) => {
    try {
        await axiosInstance.delete(`/merchant/permission/${id}`);
    } catch (error) {
        console.error('Failed to delete permission:', error);
        throw error;
    }
};

// Fungsi untuk menghapus produk secara bulk
export const bulkDeletePermissions = async (selectedPermissionIds) => {
    try {
        await axiosInstance.delete('/merchant/permission/bulk-delete', {
            data: { id: selectedPermissionIds },
        });
    } catch (error) {
        console.error('Failed to delete selected permissions:', error);
        throw error;
    }
};

// Fungsi untuk memperbarui data produk
export const updateExistingPermission = async (permission) => {
    try {
        const response = await axiosInstance.put(`/merchant/permission/update/${permission.id}`, {
            permission: permission.permission,
        });
        return response.data;
    } catch (error) {
        console.error('Error updating permission:', error);
        throw error;
    }
};
