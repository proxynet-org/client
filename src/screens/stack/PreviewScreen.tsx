import { Text } from '@rneui/themed';
import { Container, NavigationButton } from 'components';
import { useToggleScreen } from 'hooks';

export function PreviewScreen() {
  useToggleScreen({ hideOnBlur: true });
  return (
    <Container>
      <Text>PreviewScreen</Text>
      <NavigationButton name="PostScreen" />
      <NavigationButton name="ChatRoomScreen" />
    </Container>
  );
}
