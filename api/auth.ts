import { SignInPayload, SignUpPayload, Token } from '@/types/auth';
import api, { setAccessToken } from './api';

export async function singin(data: SignInPayload) {
  const response = await api.post<Token>('/auth/signin', data);
  setAccessToken(response.data);
  return response.data;
}

export async function singup(data: SignUpPayload) {
  const response = await api.post<Token>('/auth/signup', data);
  setAccessToken(response.data);
  return response.data;
}

export async function signout() {
  await api.post('/auth/signout');
  setAccessToken({ access_token: '', refresh_token: '' });
}

export async function forgotPassword(email: string) {
  await api.post('/auth/forgot-password', { email });
}
