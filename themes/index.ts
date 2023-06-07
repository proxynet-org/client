import {
  DefaultTheme as NavigationLightTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {
  MD3DarkTheme as DarkTheme,
  MD3LightTheme as LightTheme,
  adaptNavigationTheme,
} from 'react-native-paper';

import light from './light.json';
import dark from './dark.json';

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

export default themes;
