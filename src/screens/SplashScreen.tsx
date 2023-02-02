import { View } from 'react-native';
import { Text } from '@rneui/themed';

export function SplashScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
      }}
    >
      <Text center>SplashScreen</Text>
    </View>
  );
}
