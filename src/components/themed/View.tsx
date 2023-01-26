import {
  SafeAreaView as DefaultSafeAreaView,
  View as DefaultView,
} from 'react-native';
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
