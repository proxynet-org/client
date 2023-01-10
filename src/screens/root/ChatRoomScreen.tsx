import { Text } from '@rneui/themed';
import { NavigationButton, Container } from 'components';
import { useFocus } from 'hooks';

export function ChatRoomScreen() {
  useFocus({ hideOnBlur: true });

  return (
    <Container>
      <Text>ChatRoomScreen</Text>
      <NavigationButton name="DirectMessageScreen" />
    </Container>
  );
}
