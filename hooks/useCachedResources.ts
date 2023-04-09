import { useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';

export default function useCachedResources() {
  const [loaded, error] = Font.useFonts({
    // eslint-disable-next-line global-require
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return [loaded, error];
}
