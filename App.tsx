import 'react-native-gesture-handler';
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

import useCachedResources from '@/hooks/useCachedResources';
import Routes from '@/routes/Routes';
import { AuthProvider } from '@/contexts/AuthContext';

const adaptedTheme = adaptNavigationTheme({
  reactNavigationLight: NavigationLightTheme,
  materialLight: LightTheme,
  reactNavigationDark: NavigationDarkTheme,
  materialDark: DarkTheme,
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
  const theme = themes[colorScheme ?? 'light'];

  if (!loaded || error) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PaperProvider theme={theme.paper}>
          <NavigationContainer theme={theme.navigation}>
            <Routes />
          </NavigationContainer>
        </PaperProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
