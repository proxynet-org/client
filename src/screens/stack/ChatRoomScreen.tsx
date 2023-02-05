import { Text } from '@rneui/themed';
import { NavigationButton } from 'components';
import { useToggleScreen } from 'hooks';
import { View } from 'react-native';

export function ChatRoomScreen() {
  useToggleScreen({ hideOnBlur: true });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent',
      }}
    >
      <Text>ChatRoomScreen</Text>
      <NavigationButton name="DirectMessageScreen" />
    </View>
  );
}
