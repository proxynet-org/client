import axios from 'axios';
import { getSecureItem, setSecureItem } from '@/utils/secureStore';
import { Token } from '@/types/auth';

const BASE_URL = '10.0.2.2:8000';
export const BASE_URL_API = `http://${BASE_URL}/api`;
export const BASE_URL_WS = `ws://${BASE_URL}/ws/chat`;

const api = axios.create({
  baseURL: BASE_URL_API,
});

export const setAccessToken = async (token: Token) => {
  console.log('Setting access token...', token);
  api.defaults.headers.Authorization = `Bearer ${token.access}`;
  await setSecureItem('refresh_token', token.refresh);
};

const refreshAccessToken = async () => {
  console.log('Refreshing access token...');
  const refreshToken = await getSecureItem('refresh_token');
  const response = await api.post<Token>('/token/refresh/', {
    refresh: refreshToken,
  });
  await setAccessToken(response.data);
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    if (error.response.status === 401 && !request.retry) {
      request.retry = true;
      await refreshAccessToken();
      return api.request(request);
    }
    return Promise.reject(error);
  },
);

export default api;
