import { Text } from '@rneui/themed';
import { View } from 'react-native';
import { useToggleScreen } from 'hooks';

export function DirectMessageScreen() {
  useToggleScreen({ hideOnBlur: true });
  return (
    <View className="flex-1 bg-transparent">
      <Text>DirectMessageScreen</Text>
    </View>
  );
}
