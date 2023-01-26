import { CommonActions, useNavigation } from '@react-navigation/native';
import { Text } from '@rneui/themed';
import { NavigationButton } from 'components';
import { useToggleScreen } from 'hooks';
import { View } from 'react-native';

export function CreateChatRoomScreen() {
  const navigation = useNavigation();
  useToggleScreen({
    hideOnBlur: true,
    onBlur: () => {
      navigation.dispatch((state) => {
        const routes = state.routes.filter(
          (r) => r.name !== 'CreateChatRoomScreen',
        );

        return CommonActions.reset({
          ...state,
          routes,
          index: routes.length - 1,
        });
      });
    },
  });

  return (
    <View className="flex-1 bg-transparent">
      <Text>CreateChatRoomScreen</Text>
      <NavigationButton name="ChatRoomScreen" />
    </View>
  );
}
