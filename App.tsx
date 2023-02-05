import { useEffect } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@rneui/themed';
import {
  QueryClient,
  QueryClientProvider,
  onlineManager,
  focusManager,
} from 'react-query';
import NetInfo from '@react-native-community/netinfo';

import { Navigation } from 'navigation';
import { useCachedResources } from 'hooks';
import { GlobalTheme } from 'static';
import { AuthProvider } from 'providers';
import { SplashScreen } from 'screens';

const queryClient = new QueryClient();

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

export default function App() {
  const isLoadingComplete = useCachedResources();

  onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state) => {
      setOnline(Boolean(state.isConnected));
    });
  });

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);

    return () => subscription.remove();
  }, []);

  if (!isLoadingComplete) return <SplashScreen />;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemeProvider theme={GlobalTheme}>
          <AuthProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Navigation />
            </GestureHandlerRootView>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
