import { Text } from '@rneui/themed';
import { Container } from 'components';
import { useFocus } from 'hooks';

export function DirectMessageScreen() {
  useFocus({ hideOnBlur: true });
  return (
    <Container>
      <Text>DirectMessageScreen</Text>
    </Container>
  );
}
