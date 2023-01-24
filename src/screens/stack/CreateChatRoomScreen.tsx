import { CommonActions, useNavigation } from '@react-navigation/native';
import { Text } from '@rneui/themed';
import { NavigationButton, Container } from 'components';
import { useToggleScreen } from 'hooks';

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
    <Container>
      <Text>CreateChatRoomScreen</Text>
      <NavigationButton name="ChatRoomScreen" />
    </Container>
  );
}
