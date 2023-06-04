import axios from 'axios';
import { BASE_URL_API } from '@env';

import { getSecureItem, setSecureItem } from '@/utils/secureStore';
import { Token } from '@/types/auth';

const api = axios.create({
  baseURL: BASE_URL_API,
});

export const setAccessToken = async (token: Token) => {
  console.log('Setting access token...', token);
  api.defaults.headers.Authorization = `Bearer ${token.access}`;
  api.defaults.headers.common.Authorization = `Bearer ${token.access}`;
  if (typeof token.refresh === 'string') {
    await setSecureItem('refresh_token', token.refresh);
  }
};

export const refreshAccessToken = async () => {
  console.log('Refreshing access token...');
  const refreshToken = await getSecureItem('refresh_token');
  if (!refreshToken) {
    return Promise.reject(new Error('No refresh token'));
  }
  const response = await api.post<Token>('/token/refresh/', {
    refresh: refreshToken,
  });
  await setAccessToken(response.data);
  return Promise.resolve();
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response) {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest.retry) {
        originalRequest.retry = true;
        await refreshAccessToken();
        originalRequest.headers.Authorization =
          api.defaults.headers.Authorization;
        const response = await api(originalRequest);
        return response;
      }
    }
    return Promise.reject(error);
  },
);

export default api;
