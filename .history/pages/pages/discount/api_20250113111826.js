import axios from 'axios';
import Cookies from 'js-cookie';

// Membuat instance Axios
const axiosInstance = axios.create({
    baseURL: 'http://192.168.14.248:2358/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Fungsi untuk mendapatkan token dari cookies
const getTokenFromCookie = () => Cookies.get('token');

// Fungsi untuk merefresh token
const refreshAuthToken = async () => {
    const refreshToken = Cookies.get('refresh_token'); // Ambil refresh token dari cookies
    if (!refreshToken) throw new Error('No refresh token available');

    try {
        const response = await axios.post(
            'http://192.168.14.248:2356/api/auth/refresh',
            { refresh_token: refreshToken },
            {
                headers: {
                    'x-api-key': '3f=Pr#g1@RU-nw=30', // Tambahkan header x-api-key
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

// Fungsi untuk mengambil data Discount
export const fetchDiscountData = async (pagination = { limit: 10, page: 0 }) => {
    try {
        const response = await axiosInstance.get('/merchant/discount/pagination', {
            params: pagination,
        });
        return response.data.rows; // Asumsikan data ada di `rows`
    } catch (error) {
        console.error('Error fetching Discount data:', error);
        throw error;
    }
};

// Fungsi untuk mengambil data produk
export const fetchDiscounts = async (paginationData) => {
    try {
        const response = await axiosInstance.get('/merchant/discount/pagination', {
            params: paginationData,
        });
        return response.data.data; // Data produk
    } catch (error) {
        console.error('Error fetching discounts:', error);
        throw error;
    }
};

// Fungsi untuk membuat produk baru
export const createDiscount = async (discount) => {
    try {
        const response = await axiosInstance.post('/merchant/discount/create', discount);
        return response.data; // Respons data
    } catch (error) {
        console.error('Error creating discount:', error);
        throw error;
    }
};

// Fungsi untuk menghapus produk berdasarkan ID
export const deleteDiscount = async (id) => {
    try {
        await axiosInstance.delete(`/merchant/discount/${id}`);
    } catch (error) {
        console.error('Failed to delete discount:', error);
        throw error;
    }
};

// Fungsi untuk menghapus produk secara bulk
export const bulkDeleteDiscounts = async (selectedDiscountIds) => {
    try {
        await axiosInstance.delete('/merchant/discount/bulk-delete', {
            data: { id: selectedDiscountIds },
        });
    } catch (error) {
        console.error('Failed to delete selected discounts:', error);
        throw error;
    }
};

// Fungsi untuk memperbarui data produk
export const updateExistingDiscount = async (discount) => {
    try {
        const response = await axiosInstance.put(`/merchant/discount/update/${discount.id}`, {
            discount_name: discount.discount_name,
            discount_percentage: discount.discount_percentage,
            description: discount.description,
            status: discount.status,
        });
        return response.data;
    } catch (error) {
        console.error('Error updating discount:', error);
        throw error;
    }
};
