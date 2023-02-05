import { Text } from '@rneui/themed';
import { View } from 'react-native';
import { useToggleScreen } from 'hooks';

export function DirectMessageScreen() {
  useToggleScreen({ hideOnBlur: true });
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent',
      }}
    >
      <Text>DirectMessageScreen</Text>
    </View>
  );
}
