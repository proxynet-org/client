import { useNavigation } from '@react-navigation/native';
import { Text } from '@rneui/themed';
import { View } from 'components';

export function RegisterScreen() {
  const navigation = useNavigation();
  return (
    <View>
      <Text>RegisterScreen</Text>
    </View>
  );
}
