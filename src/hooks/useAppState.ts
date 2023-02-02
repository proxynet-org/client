import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useAppState({
  onChange,
  onForeground,
  onBackground,
}: {
  onChange?: (status: AppStateStatus) => void;
  onForeground?: () => void;
  onBackground?: () => void;
}) {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (
          appState.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          onForeground?.();
        }
        if (
          appState === 'active' &&
          nextAppState.match(/inactive|background/)
        ) {
          onBackground?.();
        }
        setAppState(nextAppState);
        onChange?.(nextAppState);
      },
    );

    return () => subscription.remove();
  }, [onChange, onForeground, onBackground, appState]);

  return { appState };
}
