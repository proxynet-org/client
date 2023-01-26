import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackNavigator } from './RootStackNavigator';
import { useTheme, useThemeMode } from '@rneui/themed';
import { NavigationTheme } from 'static';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';

export function Navigation() {
  const { mode } = useThemeMode();
  const { theme } = useTheme();

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(theme.colors.background);
  }, [theme, mode]);

  return (
    <NavigationContainer theme={NavigationTheme[mode]}>
      <StatusBar style="inverted" />
      <RootStackNavigator />
    </NavigationContainer>
  );
}
