import { Text } from '@rneui/themed';
import { Container } from 'components';
import { useToggleScreen } from 'hooks';

export function DirectMessageScreen() {
  useToggleScreen({ hideOnBlur: true });
  return (
    <Container>
      <Text>DirectMessageScreen</Text>
    </Container>
  );
}
