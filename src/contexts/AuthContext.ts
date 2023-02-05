import { createContext } from 'react';

export interface AuthState {
  userToken: string | undefined | null;
  status: 'idle' | 'signOut' | 'signIn';
}

export type AuthAction =
  | { type: 'SIGN_IN'; token: string }
  | { type: 'SIGN_OUT' };

export type SignUpPayload = {
  fullName: string;
  birthDate: string;
  phone: string;
  email: string;
  password: string;
};
export type SignInPayload = { email: string; password: string };

export interface AuthContextActions {
  signUp: (data: SignUpPayload) => void;
  signIn: (data: SignInPayload) => void;
  signOut: () => void;
}

export interface AuthContextType extends AuthState, AuthContextActions {}

export const AuthContext = createContext<AuthContextType>({
  status: 'idle',
  userToken: null,
  signUp: (data) => console.log('signUp', data),
  signIn: (data) => console.log('signIn', data),
  signOut: () => console.log('signOut'),
});
