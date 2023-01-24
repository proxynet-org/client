import { Text } from '@rneui/themed';
import { NavigationButton } from 'components';
import { useToggleScreen } from 'hooks';
import i18n from 'languages';
import { View } from 'react-native';

export function MapScreen() {
  const isFocused = useToggleScreen();
  return (
    <View className="flex-1 bg-gray-500">
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
    </View>
  );
}
