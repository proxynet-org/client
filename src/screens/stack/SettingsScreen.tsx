import { Text } from '@rneui/themed';
import { useToggleScreen } from 'hooks';
import { View } from 'react-native';

export function SettingsScreen() {
  useToggleScreen({ hideOnBlur: true });
  return (
    <View className="flex-1 bg-transparent">
      <Text>SettingsScreen</Text>
    </View>
  );
}
