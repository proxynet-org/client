import { createContext, useContext } from 'react';

export const PreferencesContext = createContext({
  toggleTheme: () => {},
  isThemeDark: false,
});

export function usePreferences() {
  return useContext(PreferencesContext);
}
