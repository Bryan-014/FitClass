
import axios from 'axios';

const BASE_URL = 'http://192.168.18.4:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;