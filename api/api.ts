import axios from 'axios';
import { getSecureItem, setSecureItem } from '@/utils/secureStore';
import { Token } from '@/types/auth';

export const BASE_URL = 'http://192.168.1.15:3001';
export const BASE_URL_WS = `ws://${BASE_URL.replace('http://', '')}/ws`;

const api = axios.create({
  baseURL: BASE_URL,
});

export const setAccessToken = async (token: Token) => {
  console.log('Setting access token...');
  api.defaults.headers.Authorization = `Bearer ${token.access_token}`;
  await setSecureItem('refresh_token', token.refresh_token);
};

const refreshAccessToken = async () => {
  console.log('Refreshing access token...');
  const refreshToken = await getSecureItem('refresh_token');
  const response = await api.post<Token>('/refresh', {
    refresh_token: refreshToken,
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
