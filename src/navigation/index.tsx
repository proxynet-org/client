import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackNavigator } from './RootStackNavigator';
import { useThemeMode } from '@rneui/themed';
import { NavigationTheme } from 'static';

export default function Navigation() {
  const { mode } = useThemeMode();
  return (
    <NavigationContainer theme={NavigationTheme[mode]}>
      <RootStackNavigator />
    </NavigationContainer>
  );
}

export * from './RootStackNavigator';
