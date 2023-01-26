import { Text } from '@rneui/themed';
import { NavigationButton } from 'components';
import { useToggleScreen } from 'hooks';
import { View } from 'react-native';

export function ChatRoomScreen() {
  useToggleScreen({ hideOnBlur: true });

  return (
    <View className="flex-1 bg-transparent">
      <Text>ChatRoomScreen</Text>
      <NavigationButton name="DirectMessageScreen" />
    </View>
  );
}
