import { Text } from '@rneui/themed';
import { Container } from 'components';
import { useFocus } from 'hooks';

export function SettingsScreen() {
  useFocus({ hideOnBlur: true });
  return (
    <Container>
      <Text>SettingsScreen</Text>
    </Container>
  );
}
