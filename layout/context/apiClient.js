import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: 'http://localhost:2356/api/v1/logout',
});

export default apiClient;