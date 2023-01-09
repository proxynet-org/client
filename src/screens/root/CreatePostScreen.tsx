import { CommonActions, useNavigation } from '@react-navigation/native';
import { Text } from '@rneui/themed';
import { NavigationButton, Container } from 'components';
import { useFocus } from 'hooks';

export function CreatePostScreen() {
  const navigation = useNavigation();
  useFocus({
    hideOnBlur: true,
    onBlur: () => {
      navigation.dispatch((state) => {
        // Remove the create route from the stack
        const routes = state.routes.filter(
          (r) => r.name !== 'CreatePostScreen',
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
      <Text>CreatePostScreen</Text>
      <NavigationButton name="PostScreen" />
    </Container>
  );
}
