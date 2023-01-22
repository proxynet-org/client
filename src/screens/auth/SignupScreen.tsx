import { Text, useTheme } from '@rneui/themed';
import { View } from 'components';
import { AuthTabParams } from 'navigation';
import { TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';

export function SignupScreen() {
  const navigation = useNavigation<NavigationProp<AuthTabParams>>();

  const { theme } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
        <Text>Already have an account ?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SigninScreen')}>
          <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
            Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
