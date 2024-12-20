import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import apiClient from './apiClient';  // Sesuaikan path dengan lokasi file Anda

const withAuth = (WrappedComponent) => {

  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = Cookies.get('token');
      if (!token) {
        router.push('/accounts/tap/login');
      } else {
        // Interceptor untuk apiClient
        const interceptor = apiClient.interceptors.response.use(
          (response) => {
            return response;
          },
          (error) => {
            if (error.response && error.response.status === 401 && error.response.data && error.response.data.error === "unauthorized") {
              // Hapus token dari cookies
              Cookies.remove('token');
              
              // Hapus interceptor yang telah ditambahkan
              apiClient.interceptors.response.eject(interceptor);
              
              // Arahkan pengguna ke halaman login
              router.push('/accounts/tap/login');
            }
            return Promise.reject(error);
          }
        );
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;