import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LoginScreen, RegisterScreen } from 'screens';

const AuthTab = createBottomTabNavigator<AuthTabParams>();

export function AuthTabNavigator() {
  return (
    <AuthTab.Navigator initialRouteName="LoginScreen">
      <AuthTab.Screen name="LoginScreen" component={LoginScreen} />
      <AuthTab.Screen name="RegisterScreen" component={RegisterScreen} />
    </AuthTab.Navigator>
  );
}

export type AuthTabParams = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
};
