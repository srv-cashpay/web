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
const getRefreshTokenFromCookie = () => Cookies.get('refresh_token');

// Fungsi untuk merefresh token
const refreshAuthToken = async () => {
    const refreshToken = getRefreshTokenFromCookie(); 
    if (!refreshToken) throw new Error('No refresh token available');

    try {
        const response = await axios.post(
            'http://192.168.14.248:2356/api/auth/refresh',
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
export const fetchMerkData = async () => {
    try {
        const response = await axiosInstance.get('/merchant/product/merk');
        return response.data; // Asumsikan data ada langsung di `data`
    } catch (error) {
        console.error('Error fetching Merk data:', error);
        throw error;
    }
};

// Fungsi untuk mengambil data Category
export const fetchCategoryData = async () => {
    try {
        const response = await axiosInstance.get('/merchant/product/category');
        return response.data; // Asumsikan data ada langsung di `data`
    } catch (error) {
        console.error('Error fetching Category data:', error);
        throw error;
    }
};

// Fungsi untuk mengambil data produk
export const fetchProducts = async (paginationData) => {
    try {
        const response = await axiosInstance.get('/merchant/product/pagination', {
            params: paginationData,
        });
        return response.data.data; // Data produk
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

// Fungsi untuk membuat produk baru
export const createProduct = async (product) => {
    try {
        const response = await axiosInstance.post('/merchant/product/create', product);
        return response.data; // Respons data
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

// Fungsi untuk menghapus produk berdasarkan ID
export const deleteProduct = async (id) => {
    try {
        await axiosInstance.delete(`/merchant/product/${id}`);
    } catch (error) {
        console.error('Failed to delete product:', error);
        throw error;
    }
};

// Fungsi untuk menghapus produk secara bulk
export const bulkDeleteProducts = async (selectedProductIds) => {
    try {
        await axiosInstance.delete('/merchant/product/bulk-delete', {
            data: { id: selectedProductIds },
        });
    } catch (error) {
        console.error('Failed to delete selected products:', error);
        throw error;
    }
};

// Fungsi untuk memperbarui data produk
export const updateExistingProduct = async (product) => {
    try {
        const response = await axiosInstance.put(`/merchant/product/update/${product.id}`, {
            product_name: product.product_name,
            stock: product.stock,
            minimal_stock: product.minimal_stock,
            price: product.price,
            status: product.status,
            merk: product.merk,
        });
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export const uploadImage = async (id, file) => {
    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axiosInstance.put(`/merchant/product/upload/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};