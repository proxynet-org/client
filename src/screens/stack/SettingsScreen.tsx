import { Text } from '@rneui/themed';
import { useToggleScreen } from 'hooks';
import { View } from 'react-native';

export function SettingsScreen() {
  useToggleScreen({ hideOnBlur: true });
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent',
      }}
    >
      <Text>SettingsScreen</Text>
    </View>
  );
}
