import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Text } from '@rneui/themed';
import { View } from 'components';
import { AuthTabParams } from 'navigation';
import React from 'react';

export function ForgotPasswordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthTabParams>>();

  return (
    <View className="flex-1 items-center justify-center">
      <Text>ForgotPasswordScreen</Text>
      <Button
        title="CREATE A NEW ACCOUNT"
        onPress={() => {
          navigation.goBack();
          navigation.navigate('SignupScreen');
        }}
      />
      <Button title="BACK TO LOGIN" onPress={() => navigation.goBack()} />
    </View>
  );
}
