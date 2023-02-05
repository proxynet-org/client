import { Text } from '@rneui/themed';
import { NavigationButton } from 'components';
import { useToggleScreen } from 'hooks';
import { View } from 'react-native';

export function DirectMessagesScreen() {
  useToggleScreen({ hideOnBlur: true });
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent',
      }}
    >
      <Text>DirectMessagesScreen</Text>
      <NavigationButton name="DirectMessageScreen" />
    </View>
  );
}
