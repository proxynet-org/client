import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@rneui/themed';

import Navigation from 'navigation';
import { useCachedResources } from 'hooks';
import { GlobalTheme } from 'static';

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <ThemeProvider theme={GlobalTheme}>
          <Navigation />
          <StatusBar />
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }
}
