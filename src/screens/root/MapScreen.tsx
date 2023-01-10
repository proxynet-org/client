import { Text } from '@rneui/themed';
import { Container, NavigationButton } from 'components';
import { useFocus } from 'hooks';

export function MapScreen() {
  const isFocused = useFocus();
  return (
    <Container style={{ backgroundColor: 'grey', flex: 1 }}>
      {isFocused && (
        <>
          <Text>MapScreen</Text>
          <NavigationButton name="PreviewScreen" />
          <NavigationButton name="CreateChatRoomScreen" />
          <NavigationButton name="CreatePostScreen" />
          <NavigationButton name="DirectMessagesScreen" />
          <NavigationButton name="SettingsScreen" />
        </>
      )}
    </Container>
  );
}
