import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: 'http://192.168.14.185:2356/api/v1/logout',
});

export default apiClient;