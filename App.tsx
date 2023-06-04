import 'react-native-gesture-handler';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  NavigationContainer,
  DefaultTheme as NavigationLightTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {
  MD3DarkTheme as DarkTheme,
  MD3LightTheme as LightTheme,
  Provider as PaperProvider,
  adaptNavigationTheme,
} from 'react-native-paper';
import { enGB, fr, registerTranslation } from 'react-native-paper-dates';

import light from '@/themes/light.json';
import dark from '@/themes/dark.json';

import useCachedResources from '@/hooks/useCachedResources';
import Routes from '@/routes/Routes';
import { AuthProvider } from '@/contexts/AuthContext';
import { PreferencesContext } from './contexts/PreferencesContext';
import { setItem, getItem } from '@/utils/asyncStore';

const adaptedTheme = adaptNavigationTheme({
  reactNavigationLight: NavigationLightTheme,
  materialLight: { ...LightTheme, colors: light.colors },
  reactNavigationDark: NavigationDarkTheme,
  materialDark: { ...DarkTheme, colors: dark.colors, mode: 'adaptive' },
});

const themes = {
  light: {
    paper: LightTheme,
    navigation: adaptedTheme.LightTheme,
  },
  dark: {
    paper: DarkTheme,
    navigation: adaptedTheme.DarkTheme,
  },
};

registerTranslation('en', enGB);
registerTranslation('fr', fr);

export default function App() {
  const [loaded, error] = useCachedResources();

  const colorScheme = useColorScheme();
  const [isThemeDark, setIsThemeDark] = useState(false);
  const theme = isThemeDark ? themes.dark : themes[colorScheme ?? 'light'];
  useEffect(() => {
    getItem('isThemeDark').then((value) => {
      if (value) {
        setIsThemeDark(JSON.parse(value));
      }
    });
  }, []);
  const toggleTheme = useCallback(async () => {
    const value = !isThemeDark;
    await setItem('isThemeDark', JSON.stringify(value));
    return setIsThemeDark(value);
  }, [isThemeDark]);
  const preferences = useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark],
  );

  if (!loaded || error) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PreferencesContext.Provider value={preferences}>
          <PaperProvider theme={theme.paper}>
            <NavigationContainer theme={theme.navigation}>
              <Routes />
            </NavigationContainer>
          </PaperProvider>
        </PreferencesContext.Provider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
