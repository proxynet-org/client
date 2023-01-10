import { Text } from '@rneui/themed';
import { Container, NavigationButton } from 'components';

export function LoginScreen() {
  return (
    <Container>
      <Text>LoginScreen</Text>
      <NavigationButton name="RegisterScreen" />
    </Container>
  );
}
