import { Text } from '@rneui/themed';
import { NavigationButton } from 'components';
import { useToggleScreen } from 'hooks';
import { View } from 'react-native';

export function PostScreen() {
  useToggleScreen({ hideOnBlur: true });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent',
      }}
    >
      <Text>PostScreen</Text>
      <NavigationButton name="DirectMessageScreen" />
    </View>
  );
}
