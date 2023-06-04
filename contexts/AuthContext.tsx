import {
  createContext,
  useMemo,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { SignUpPayload, SignInPayload, User } from '@/types/auth';
import { getUserInfo, singin, singup } from '@/api/auth';
import { refreshAccessToken } from '@/api/api';

interface AuthContextState {
  user?: User;
}

interface AuthContextActions {
  signUp: (data: SignUpPayload) => Promise<void>;
  signIn: (data: SignInPayload) => Promise<void>;
  signOut: () => void;
}

interface AuthContextType extends AuthContextState, AuthContextActions {}

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  signUp: (data) => {
    throw new Error(`signUp with ${data} is not implemented`);
  },
  signIn: (data) => {
    throw new Error(`signIn with ${data} is not implemented`);
  },
  signOut: () => {
    throw new Error(`signOut is not implemented`);
  },
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>();

  const signUp = useCallback(async (data: SignUpPayload) => {
    await singup(data);
    await getUserInfo().then(setUser);
  }, []);

  const signIn = useCallback(async (data: SignInPayload) => {
    await singin(data);
    await getUserInfo().then(setUser);
  }, []);

  const signOut = useCallback(async () => {
    setUser(undefined);
  }, []);

  useEffect(() => {
    async function tryLoggin() {
      await refreshAccessToken();
      await getUserInfo().then(setUser);
    }

    tryLoggin();
  }, []);

  const value = useMemo(
    () => ({
      user,
      signUp,
      signIn,
      signOut,
    }),
    [user, signUp, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be inside an AuthProvider with a value');
  }

  return context;
}

export { AuthProvider, useAuth };
