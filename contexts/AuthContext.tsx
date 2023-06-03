import {
  createContext,
  useMemo,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { SignUpPayload, SignInPayload } from '@/types/auth';
import { signout, singin, singup } from '@/api/auth';
import { getSecureItem } from '@/utils/secureStore';

interface AuthContextState {
  isLoggedIn: boolean;
}

interface AuthContextActions {
  signUp: (data: SignUpPayload) => Promise<void>;
  signIn: (data: SignInPayload) => Promise<void>;
  signOut: () => void;
}

interface AuthContextType extends AuthContextState, AuthContextActions {}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const signUp = useCallback(async (data: SignUpPayload) => {
    const res = await singup(data);
    setIsLoggedIn(Boolean(res));
  }, []);

  const signIn = useCallback(async (data: SignInPayload) => {
    const res = await singin(data);
    setIsLoggedIn(Boolean(res));
  }, []);

  const signOut = useCallback(async () => {
    setIsLoggedIn(false);
    return;
    await signout();
    setIsLoggedIn(false);
  }, []);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = await getSecureItem('token');
      setIsLoggedIn(Boolean(token));
    };

    checkLoggedIn();
  }, []);

  const value = useMemo(
    () => ({
      isLoggedIn,
      signUp,
      signIn,
      signOut,
    }),
    [isLoggedIn, signUp, signIn, signOut],
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
