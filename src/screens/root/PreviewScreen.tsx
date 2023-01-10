import { Text } from '@rneui/themed';
import { Container, NavigationButton } from 'components';
import { useFocus } from 'hooks';

export function PreviewScreen() {
  useFocus({ hideOnBlur: true });
  return (
    <Container>
      <Text>PreviewScreen</Text>
      <NavigationButton name="PostScreen" />
      <NavigationButton name="ChatRoomScreen" />
    </Container>
  );
}
