/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    trailingSlash: false,
    basePath: 'http://localhost:3001/', // Hapus basePath atau setel menjadi kosong untuk akses langsung di http://localhost:3000/
    publicRuntimeConfig: {
        contextPath: '', // Hapus basePath juga di sini
        uploadPath: process.env.NODE_ENV === 'production' ? '/sakai-react/upload.php' : '/api/upload'
    }
};

module.exports = nextConfig;
