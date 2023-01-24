import { Text } from '@rneui/themed';
import { Container } from 'components';
import { useToggleScreen } from 'hooks';

export function SettingsScreen() {
  useToggleScreen({ hideOnBlur: true });
  return (
    <Container>
      <Text>SettingsScreen</Text>
    </Container>
  );
}
