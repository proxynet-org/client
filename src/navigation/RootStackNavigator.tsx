import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ChatRoomScreen,
  CreateChatRoomScreen,
  CreatePostScreen,
  DirectMessageScreen,
  DirectMessagesScreen,
  MapScreen,
  PostScreen,
  PreviewScreen,
  SettingsScreen,
} from 'screens';
import { AuthTabNavigator } from './AuthTabNavigator';
import { useAuth } from 'Auth';
import { SplashScreen } from 'screens/SplashScreen';
const RootStack = createNativeStackNavigator<RootStackParams>();

export function RootStackNavigator() {
  const { isLogged, status } = useAuth();

  if (status === 'idle') {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }

  return (
    <RootStack.Navigator
      initialRouteName="MapScreen"
      screenOptions={{
        presentation: 'transparentModal',
      }}
    >
      {isLogged ? (
        <>
          <RootStack.Screen
            name="MapScreen"
            component={MapScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="CreatePostScreen"
            component={CreatePostScreen}
          />
          <RootStack.Screen
            name="CreateChatRoomScreen"
            component={CreateChatRoomScreen}
          />
          <RootStack.Screen name="PreviewScreen" component={PreviewScreen} />
          <RootStack.Screen name="PostScreen" component={PostScreen} />
          <RootStack.Screen name="ChatRoomScreen" component={ChatRoomScreen} />
          <RootStack.Screen
            name="DirectMessagesScreen"
            component={DirectMessagesScreen}
          />
          <RootStack.Screen
            name="DirectMessageScreen"
            component={DirectMessageScreen}
          />
          <RootStack.Screen name="SettingsScreen" component={SettingsScreen} />
        </>
      ) : (
        <RootStack.Screen
          name="AuthTabNavigator"
          component={AuthTabNavigator}
          options={{ headerShown: false }}
        />
      )}
    </RootStack.Navigator>
  );
}

export type RootStackParams = {
  MapScreen: undefined;
  CreatePostScreen: undefined;
  CreateChatRoomScreen: undefined;
  PreviewScreen: undefined;
  PostScreen: undefined;
  ChatRoomScreen: undefined;
  DirectMessagesScreen: undefined;
  DirectMessageScreen: undefined;
  SettingsScreen: undefined;
  AuthTabNavigator: undefined;
};
