import {
  AuthAction,
  AuthContext,
  AuthContextActions,
  AuthState,
} from 'contexts';
import {
  createRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
} from 'react';
import { getSecureItem, removeSecureItem, setSecureItem } from 'utils';

const TOKEN_KEY = 'token';

export const getToken = () => getSecureItem(TOKEN_KEY);
export const removeToken = () => removeSecureItem(TOKEN_KEY);
export const setToken = (value: string) => setSecureItem(TOKEN_KEY, value);

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

export const AuthRef = createRef<AuthContextActions>();

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(AuthReducer, {
    status: 'idle',
    userToken: null,
  });

  useEffect(() => {
    const initState = async () => {
      try {
        const userToken = await getToken();
        if (userToken !== null) {
          // TODO: call api to refresh token
          // In a production app, we need to send the token to refreshToken endpoint on the server and get a new token
          // We will also need to handle errors if sign up failed
          // After getting token, we need to persist the token using `SecureStore`
          // In the example, we'll use a dummy token
          dispatch({ type: 'SIGN_IN', token: userToken });
          await setToken(userToken);
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
  useImperativeHandle(AuthRef, () => authActions);

  const authActions: AuthContextActions = useMemo(
    () => ({
      signUp: async ({ fullName, birthDate, phone, email, password }) => {
        // TODO: call api to register
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
        // TODO: call api to login
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
