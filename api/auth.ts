import { SignInPayload, SignUpPayload, Token, User } from '@/types/auth';
import api, { setAccessToken } from './api';

export async function singin(data: SignInPayload) {
  console.log('Signing in...');
  const response = await api.post<Token>('/token/', data);
  setAccessToken(response.data);
  return response.data;
}

export async function singup(data: SignUpPayload) {
  console.log('Signing up...');
  const response = await api.post<Omit<SignUpPayload, 'password'>>(
    '/users/register/',
    data,
  );
  await singin({ username: data.username, password: data.password });
  return response.data;
}

export async function signout() {
  console.log('Signing out...');
  await api.post('/auth/signout');
  setAccessToken({ access: '', refresh: '' });
}

export async function forgotPassword(email: string) {
  console.log('Forgot password...');
  await api.post('/auth/forgot-password', { email });
}

export async function getUserInfo() {
  console.log('Getting user info...');
  const response = await api.get<User>('/users/info');
  return response.data;
}
