import { CommonActions, useNavigation } from '@react-navigation/native';
import { Text } from '@rneui/themed';
import { NavigationButton } from 'components';
import { useToggleScreen } from 'hooks';
import { View } from 'react-native';

export function CreatePostScreen() {
  const navigation = useNavigation();
  useToggleScreen({
    hideOnBlur: true,
    onBlur: () => {
      navigation.dispatch((state) => {
        // Remove the create route from the stack
        const routes = state.routes.filter(
          (r) => r.name !== 'CreatePostScreen',
        );

        return CommonActions.reset({
          ...state,
          routes,
          index: routes.length - 1,
        });
      });
    },
  });

  return (
    <View className="flex-1 bg-transparent">
      <Text>CreatePostScreen</Text>
      <NavigationButton name="PostScreen" />
    </View>
  );
}
