import axios from 'axios';
import { BASE_URL } from '@env';

import { getSecureItem, setSecureItem } from '@/utils/secureStore';
import { Token } from '@/types/auth';

export const BASE_URL_API = `http://${BASE_URL}/api`;
export const BASE_URL_WS = `ws://${BASE_URL}/ws/chat`;

const api = axios.create({
  baseURL: BASE_URL_API,
});

export const setAccessToken = async (token: Token) => {
  console.log('Setting access token...', token);
  api.defaults.headers.Authorization = `Bearer ${token.access}`;
  if (token.refresh) {
    await setSecureItem('refresh_token', token.refresh);
  }
};

export const refreshAccessToken = async () => {
  console.log('Refreshing access token...');
  const refreshToken = await getSecureItem('refresh_token');
  const response = await api.post<Token>('/token/refresh/', {
    refresh: refreshToken,
  });
  await setAccessToken(response.data);
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response) {
      const { config } = error;
      if (error.response.status === 401 && !config.retry) {
        config.retry = true;
        await refreshAccessToken();
        return api({
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${api.defaults.headers.Authorization}`,
          },
        });
      }
    }

    return Promise.reject(error);
  },
);

export default api;
