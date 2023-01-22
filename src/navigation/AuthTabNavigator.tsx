import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SigninScreen, SignupScreen } from 'screens';

const AuthTab = createBottomTabNavigator<AuthTabParams>();

export function AuthTabNavigator() {
  return (
    <AuthTab.Navigator
      initialRouteName="SigninScreen"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={() => null}
    >
      <AuthTab.Screen name="SigninScreen" component={SigninScreen} />
      <AuthTab.Screen name="SignupScreen" component={SignupScreen} />
    </AuthTab.Navigator>
  );
}

export type AuthTabParams = {
  SigninScreen: undefined;
  SignupScreen: undefined;
};
