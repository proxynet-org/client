import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

type Params = {
  onFocus?: () => void;
  onBlur?: () => void;
  hideOnBlur?: boolean;
};

export function useToggleScreen({ onBlur, onFocus, hideOnBlur }: Params = {}) {
  const navigation = useNavigation();

  useEffect(() => {
    const focus = navigation.addListener('focus', () => {
      if (hideOnBlur) {
        navigation.setOptions({
          headerShown: true,
          contentStyle: { opacity: 1 },
        });
      }
      setFocused(true);
      onFocus?.();
    });
    const blur = navigation.addListener('blur', () => {
      if (hideOnBlur) {
        navigation.setOptions({
          headerShown: false,
          contentStyle: { opacity: 0 },
        });
      }
      setFocused(false);
      onBlur?.();
    });

    return () => {
      blur();
      focus();
    };
  }, [navigation, onBlur, onFocus, hideOnBlur]);

  const [isFocused, setFocused] = useState(true);

  return isFocused;
}
