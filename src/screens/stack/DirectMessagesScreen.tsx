import { Text } from '@rneui/themed';
import { NavigationButton, Container } from 'components';
import { useToggleScreen } from 'hooks';

export function DirectMessagesScreen() {
  useToggleScreen({ hideOnBlur: true });
  return (
    <Container>
      <Text>DirectMessagesScreen</Text>
      <NavigationButton name="DirectMessageScreen" />
    </Container>
  );
}
