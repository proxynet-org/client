import axios from 'axios';
import { getSecureItem, setSecureItem } from '@/utils/secureStore';
import { Token } from '@/types/auth';

const api = axios.create({
  baseURL: 'http://192.168.1.15:3001',
});

export const setAccessToken = async (token: Token) => {
  api.defaults.headers.Authorization = `Bearer ${token.access_token}`;
  await setSecureItem('refresh_token', token.refresh_token);
};

const refreshAccessToken = async () => {
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
