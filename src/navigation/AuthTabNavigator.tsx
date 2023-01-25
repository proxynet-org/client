import { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SigninScreen, SignupScreen, ForgotPasswordScreen } from 'screens';
import { useTheme } from '@rneui/themed';

export type SigninStackParams = {
  SigninScreen: undefined;
  ForgotPasswordScreen: undefined;
};

const SigninStack = createNativeStackNavigator<SigninStackParams>();

function SigninStackNavigator() {
  const { theme } = useTheme();
  return (
    <SigninStack.Navigator initialRouteName="SigninScreen">
      <SigninStack.Screen
        name="SigninScreen"
        component={SigninScreen}
        options={{ headerShown: false }}
      />
      <SigninStack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{
          headerStyle: { backgroundColor: theme.colors.background },
          headerTitle: '',
        }}
      />
    </SigninStack.Navigator>
  );
}

export type AuthTabParams = {
  SigninStack: NavigatorScreenParams<SigninStackParams>;
  SignupScreen: undefined;
};

const AuthTab = createBottomTabNavigator<AuthTabParams>();

export function AuthTabNavigator() {
  return (
    <AuthTab.Navigator
      initialRouteName="SigninStack"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={() => null}
    >
      <AuthTab.Screen name="SigninStack" component={SigninStackNavigator} />
      <AuthTab.Screen name="SignupScreen" component={SignupScreen} />
    </AuthTab.Navigator>
  );
}
