import axios from 'axios';
import Cookies from 'js-cookie';

// Membuat instance Axios
const axiosInstance = axios.create({
    baseURL: 'https://cashpay.my.id:2358/api',
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
            'https://cashpay.my.id:2356/api/auth/refresh',
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

// Fungsi untuk mengambil data Merk
export const fetchMerkData = async (pagination = { limit: 10, page: 0 }) => {
    try {
        const response = await axiosInstance.get('/merchant/merk/pagination', {
            params: pagination,
        });
        return response.data.rows; // Asumsikan data ada di `rows`
    } catch (error) {
        console.error('Error fetching Merk data:', error);
        throw error;
    }
};

// Fungsi untuk mengambil data produk
export const fetchMerks = async (paginationData) => {
    try {
        const response = await axiosInstance.get('/merchant/merk/pagination', {
            params: paginationData,
        });
        return response.data.data; // Data produk
    } catch (error) {
        console.error('Error fetching merks:', error);
        throw error;
    }
};

// Fungsi untuk membuat produk baru
export const createMerk = async (merk) => {
    try {
        const response = await axiosInstance.post('/merchant/merk/create', merk);
        return response.data; // Respons data
    } catch (error) {
        console.error('Error creating merk:', error);
        throw error;
    }
};

// Fungsi untuk menghapus produk berdasarkan ID
export const deleteMerk = async (id) => {
    try {
        await axiosInstance.delete(`/merchant/merk/${id}`);
    } catch (error) {
        console.error('Failed to delete merk:', error);
        throw error;
    }
};

// Fungsi untuk menghapus produk secara bulk
export const bulkDeleteMerks = async (selectedMerkIds) => {
    try {
        await axiosInstance.delete('/merchant/merk/bulk-delete', {
            data: { id: selectedMerkIds },
        });
    } catch (error) {
        console.error('Failed to delete selected merks:', error);
        throw error;
    }
};

// Fungsi untuk memperbarui data produk
export const updateExistingMerk = async (merk) => {
    try {
        const response = await axiosInstance.put(`/merchant/merk/update/${merk.id}`, {
            merk_name: merk.merk_name,
            description: merk.description,
            status: merk.status,
        });
        return response.data;
    } catch (error) {
        console.error('Error updating merk:', error);
        throw error;
    }
};
