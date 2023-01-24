import * as React from 'react';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'token';

export async function getItem(key: string): Promise<string | null> {
  const value = await SecureStore.getItemAsync(key);
  return value ? value : null;
}

export async function setItem(key: string, value: string): Promise<void> {
  return SecureStore.setItemAsync(key, value);
}
export async function removeItem(key: string): Promise<void> {
  return SecureStore.deleteItemAsync(key);
}

export const getToken = () => getItem(TOKEN_KEY);
export const removeToken = () => removeItem(TOKEN_KEY);
export const setToken = (value: string) => setItem(TOKEN_KEY, value);

interface AuthState {
  userToken: string | undefined | null;
  status: 'idle' | 'signOut' | 'signIn';
  isLogged: boolean;
}
type AuthAction = { type: 'SIGN_IN'; token: string } | { type: 'SIGN_OUT' };

type SignUpPayload = {
  fullName: string;
  birthDate: string;
  phone: string;
  email: string;
  password: string;
};
type SignInPayload = { email: string; password: string };

interface AuthContextActions {
  signUp: (data: SignUpPayload) => void;
  signIn: (data: SignInPayload) => void;
  signOut: () => void;
}

interface AuthContextType extends AuthState, AuthContextActions {}

const AuthContext = React.createContext<AuthContextType>({
  status: 'idle',
  userToken: null,
  isLogged: false,
  signUp: (data) => console.log('signUp', data),
  signIn: (data) => console.log('signIn', data),
  signOut: () => console.log('signOut'),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(AuthReducer, {
    status: 'idle',
    userToken: null,
    isLogged: false,
  });

  React.useEffect(() => {
    const initState = async () => {
      try {
        const userToken = await getToken();
        if (userToken !== null) {
          dispatch({ type: 'SIGN_IN', token: userToken });
        } else {
          dispatch({ type: 'SIGN_OUT' });
        }
      } catch (e) {
        console.log('error', e);
        dispatch({ type: 'SIGN_OUT' });
      }
    };

    initState();
  }, []);

  // we add all Auth Action to ref
  React.useImperativeHandle(AuthRef, () => authActions);

  const authActions: AuthContextActions = React.useMemo(
    () => ({
      signUp: async ({ fullName, birthDate, phone, email, password }) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token
        console.log(
          'signUn, response token',
          fullName,
          birthDate,
          phone,
          email,
          password,
        );
        const token = 'get token from server';
        dispatch({ type: 'SIGN_IN', token });
        await setToken(token);
      },
      signIn: async ({ email, password }) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token
        console.log('signIn, response token', email, password);
        const token = 'get token from server';
        dispatch({ type: 'SIGN_IN', token });
        await setToken(token);
      },
      signOut: async () => {
        await removeToken();
        dispatch({ type: 'SIGN_OUT' });
      },
    }),
    [],
  );

  return (
    <AuthContext.Provider value={{ ...state, ...authActions }}>
      {children}
    </AuthContext.Provider>
  );
};

const AuthReducer = (prevState: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        ...prevState,
        status: 'signIn',
        userToken: action.token,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        status: 'signOut',
        userToken: null,
      };
  }
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be inside an AuthProvider with a value');
  }
  const isLogged = context.status === 'signIn';
  return { ...context, isLogged };
};

// In case you want to use Auth functions outside React tree
export const AuthRef = React.createRef<AuthContextActions>();

/*
you can eaisly import  AuthRef and start using Auth actions
AuthRef.current.signOut()
*/
