import { Text } from '@rneui/themed';
import { Container, NavigationButton } from 'components';
import { useFocus } from 'hooks';
import i18n from 'languages';

export function MapScreen() {
  const isFocused = useFocus();
  return (
    <Container style={{ backgroundColor: 'grey', flex: 1 }}>
      {isFocused && (
        <>
          <Text>
            {i18n.t('Welcome')} {i18n.t('welcome')}
          </Text>
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
