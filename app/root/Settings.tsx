import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Button, MD3Theme, useTheme } from 'react-native-paper';
import { View } from '@/components/Themed';
import { useAuth } from '@/contexts/AuthContext';

function makeStyle(theme: MD3Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backdrop,
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: 10,
    },
  });
}

export default function Settings() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyle(theme), [theme]);
  const { signOut } = useAuth();
  return (
    <View style={styles.container}>
      <Button icon="logout" mode="contained" onPress={signOut}>
        Logout
      </Button>
    </View>
  );
}
