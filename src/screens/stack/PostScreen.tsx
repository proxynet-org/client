import { Text } from '@rneui/themed';
import { NavigationButton, Container } from 'components';
import { useToggleScreen } from 'hooks';

export function PostScreen() {
  useToggleScreen({ hideOnBlur: true });

  return (
    <Container>
      <Text>PostScreen</Text>
      <NavigationButton name="DirectMessageScreen" />
    </Container>
  );
}
