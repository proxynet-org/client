import { Text } from '@rneui/themed';
import { NavigationButton, Container } from 'components';
import { useFocus } from 'hooks';

export function PostScreen() {
  useFocus({ hideOnBlur: true });

  return (
    <Container>
      <Text>PostScreen</Text>
      <NavigationButton name="DirectMessageScreen" />
    </Container>
  );
}
