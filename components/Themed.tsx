/* eslint-disable import/prefer-default-export */
import { forwardRef } from 'react';
import { SafeAreaView } from 'react-native';
import { useTheme } from 'react-native-paper';

export const View = forwardRef<SafeAreaView, SafeAreaView['props']>(
  ({ style, ...props }, ref) => {
    const { colors } = useTheme();

    return (
      <SafeAreaView
        ref={ref}
        style={[{ backgroundColor: colors.background }, style]}
        {...props}
      />
    );
  },
);

View.displayName = 'View';
