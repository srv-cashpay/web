import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:2356/api/v1/logout',
});

export default apiClient;