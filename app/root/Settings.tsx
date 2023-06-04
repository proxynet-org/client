import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Button, MD3Theme, Switch, Text, useTheme } from 'react-native-paper';
import { View } from '@/components/Themed';
import { useAuth } from '@/contexts/AuthContext';
import i18n from '@/languages';
import { usePreferences } from '@/contexts/PreferencesContext';

function makeStyle(theme: MD3Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backdrop,
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 100,
      paddingHorizontal: 10,
    },
  });
}

export default function Settings() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyle(theme), [theme]);
  const { signOut } = useAuth();

  const { toggleTheme, isThemeDark } = usePreferences();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="labelLarge">{i18n.t('settings.light')}</Text>
        <Switch value={isThemeDark} onValueChange={toggleTheme} />
        <Text variant="labelLarge">{i18n.t('settings.dark')}</Text>
      </View>
      <Button icon="logout" mode="contained" onPress={signOut}>
        {i18n.t('auth.signout.button')}
      </Button>
    </View>
  );
}
