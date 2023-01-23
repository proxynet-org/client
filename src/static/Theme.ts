import { Platform } from 'react-native';
import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';
import { createTheme, ThemeMode, lightColors, darkColors } from '@rneui/themed';

export const GlobalTheme = createTheme({
  lightColors: {
    ...Platform.select({
      default: lightColors.platform.android,
      ios: lightColors.platform.ios,
    }),
  },
  darkColors: {
    ...Platform.select({
      default: darkColors.platform.android,
      ios: darkColors.platform.ios,
    }),
    primary: '#0DF5E3',
    background: '#201A30',
    searchBg: '#38304C',
  },
  mode: 'dark',
  components: {
    Text: (props) => ({
      style: {
        fontWeight: props.bold ? 'bold' : 'normal',
      },
    }),
  },
});

export const NavigationTheme: Record<ThemeMode, Theme> = {
  dark: DarkTheme,
  light: DefaultTheme,
};
