import { Text } from '@rneui/themed';
import { NavigationButton } from 'components';
import { useToggleScreen } from 'hooks';
import { View } from 'react-native';

export function PreviewScreen() {
  useToggleScreen({ hideOnBlur: true });
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent',
      }}
    >
      <Text>PreviewScreen</Text>
      <NavigationButton name="PostScreen" />
      <NavigationButton name="ChatRoomScreen" />
    </View>
  );
}
