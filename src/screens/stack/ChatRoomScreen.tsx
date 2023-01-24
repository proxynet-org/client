import { Text } from '@rneui/themed';
import { NavigationButton, Container } from 'components';
import { useToggleScreen } from 'hooks';

export function ChatRoomScreen() {
  useToggleScreen({ hideOnBlur: true });

  return (
    <Container>
      <Text>ChatRoomScreen</Text>
      <NavigationButton name="DirectMessageScreen" />
    </Container>
  );
}
