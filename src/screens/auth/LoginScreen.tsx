import { useNavigation } from '@react-navigation/native';
import { Text } from '@rneui/themed';
import { View } from 'components';

export function LoginScreen() {
  const navigation = useNavigation();
  return (
    <View>
      <Text>LoginScreen</Text>
    </View>
  );
}
