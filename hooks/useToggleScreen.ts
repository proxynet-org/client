import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

type Params = {
  onFocus?: () => void;
  onBlur?: () => void;
  hideOnBlur?: boolean;
};

export default function useToggleScreen({
  onBlur,
  onFocus,
  hideOnBlur,
}: Params = {}) {
  const navigation = useNavigation();
  const [isFocused, setFocused] = useState(true);

  useEffect(() => {
    const focus = navigation.addListener('focus', () => {
      if (hideOnBlur) {
        navigation.setOptions({
          headerShown: true,
          contentStyle: { opacity: 1 },
          cardStyle: { opacity: 1 },
        });
      }
      setFocused(true);
      onFocus?.();
    });

    return focus;
  }, [navigation, onFocus, hideOnBlur]);

  useEffect(() => {
    const blur = navigation.addListener('blur', () => {
      if (hideOnBlur) {
        navigation.setOptions({
          headerShown: false,
          contentStyle: { opacity: 0 },
          cardStyle: { opacity: 0 },
        });
      }
      setFocused(false);
      onBlur?.();
    });

    return blur;
  }, [navigation, onBlur, hideOnBlur]);

  return isFocused;
}
