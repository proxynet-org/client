import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { enGB, fr, registerTranslation } from 'react-native-paper-dates';

import useCachedResources from '@/hooks/useCachedResources';
import Routes from '@/routes/Routes';
import { AuthProvider } from '@/contexts/AuthContext';
import { PreferencesContext } from './contexts/PreferencesContext';
import { setItem, getItem } from '@/utils/asyncStore';
import themes from '@/themes';

registerTranslation('en', enGB);
registerTranslation('fr', fr);

export default function App() {
  const [loaded, error] = useCachedResources();

  const colorScheme = useColorScheme();
  const [isThemeDark, setIsThemeDark] = useState(false);
  const theme = isThemeDark ? themes.dark : themes.light;

  useEffect(() => {
    getItem('isThemeDark').then((value) => {
      if (value) {
        setIsThemeDark(JSON.parse(value));
      } else {
        setIsThemeDark(colorScheme === 'dark');
      }
    });
  }, [colorScheme]);

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

  useEffect(() => {
    NavigationBar.setButtonStyleAsync(isThemeDark ? 'light' : 'dark');
    NavigationBar.setBackgroundColorAsync(theme.paper.colors.surface);
    NavigationBar.setVisibilityAsync('hidden');
    NavigationBar.setBehaviorAsync('overlay-swipe');
  }, [isThemeDark, theme]);

  if (!loaded || error) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PreferencesContext.Provider value={preferences}>
          <PaperProvider theme={theme.paper}>
            <NavigationContainer theme={theme.navigation}>
              <StatusBar
                style={isThemeDark ? 'light' : 'dark'}
                translucent
                backgroundColor="transparent"
              />
              <Routes />
            </NavigationContainer>
          </PaperProvider>
        </PreferencesContext.Provider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
