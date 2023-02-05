import { useContext } from 'react';
import { AuthContextType, AuthContext } from 'contexts';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be inside an AuthProvider with a value');
  }

  return context;
};
