import { Text } from '@rneui/themed';
import { NavigationButton, Container } from 'components';
import { useFocus } from 'hooks';

export function DirectMessagesScreen() {
  useFocus({ hideOnBlur: true });
  return (
    <Container>
      <Text>DirectMessagesScreen</Text>
      <NavigationButton name="DirectMessageScreen" />
    </Container>
  );
}
