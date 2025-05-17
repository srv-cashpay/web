import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: 'https://cashpay.my.id:2356/api/v1/logout',
});

export default apiClient;