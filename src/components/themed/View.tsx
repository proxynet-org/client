import {
  SafeAreaView as DefaultSafeAreaView,
  View as DefaultView,
} from 'react-native';

import Animated from 'react-native-reanimated';

import { useTheme } from '@rneui/themed';

export type SafeAreaViewProps = DefaultSafeAreaView['props'];

export function SafeAreaView(props: SafeAreaViewProps) {
  const { style, ...otherProps } = props;
  const { theme } = useTheme();

  return (
    <DefaultSafeAreaView
      style={[{ backgroundColor: theme.colors.background }, style]}
      {...otherProps}
    />
  );
}

export type ViewProps = DefaultView['props'];

export function View(props: ViewProps) {
  const { style, ...otherProps } = props;
  const { theme } = useTheme();

  return (
    <DefaultView
      style={[{ backgroundColor: theme.colors.background }, style]}
      {...otherProps}
    />
  );
}

export type AnimatedViewProps = Animated.View['props'];

export function AnimatedView(props: AnimatedViewProps) {
  const { style, ...otherProps } = props;
  const { theme } = useTheme();

  return (
    <Animated.View
      style={[{ backgroundColor: theme.colors.background }, style]}
      {...otherProps}
    />
  );
}
