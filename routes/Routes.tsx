import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import Map from '@/app/root/Map';
import Settings from '@/app/root/Settings';

import PostCreate from '@/app/post/Create';
import PostPreview from '@/app/post/Preview';
import PostComments from '@/app/post/Comments';

import ChatCreate from '@/app/chatroom/Create';
import ChatPreview from '@/app/chatroom/Preview';
import ChatRoom from '@/app/chatroom/Chatroom';

import SignIn from '@/app/auth/SignIn';
import SignUp from '@/app/auth/SignUp';
import ForgotPassword from '@/app/auth/ForgotPassword';

import { RootStackParams, AuthTabParams } from './params';
import { useAuth } from '@/contexts/AuthContext';
import Chat from '@/app/root/Chat';

const RootStack = createStackNavigator<RootStackParams>();
const AuthTab = createMaterialBottomTabNavigator<AuthTabParams>();

function AuthTabNavigator() {
  return (
    <AuthTab.Navigator
      barStyle={{
        display: 'none',
      }}
      shifting
      sceneAnimationEnabled
      sceneAnimationType="shifting"
    >
      <AuthTab.Screen name="SignIn" component={SignIn} />
      <AuthTab.Screen name="SignUp" component={SignUp} />
      <AuthTab.Screen name="ForgotPassword" component={ForgotPassword} />
    </AuthTab.Navigator>
  );
}

export default function Routes() {
  const { isLoggedIn } = useAuth();

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isLoggedIn ? (
        <RootStack.Group>
          <RootStack.Screen name="Map" component={Map} />
          <RootStack.Group
            screenOptions={{
              headerShown: true,
              presentation: 'transparentModal',
              title: '',
            }}
          >
            <RootStack.Screen name="Chat" component={Chat} />

            <RootStack.Screen name="Settings" component={Settings} />
            <RootStack.Screen name="PostCreate" component={PostCreate} />
            <RootStack.Screen name="PostPreview" component={PostPreview} />
            <RootStack.Screen name="PostComments" component={PostComments} />

            <RootStack.Screen name="ChatCreate" component={ChatCreate} />
            <RootStack.Screen name="ChatPreview" component={ChatPreview} />
            <RootStack.Screen name="ChatRoom" component={ChatRoom} />
          </RootStack.Group>
        </RootStack.Group>
      ) : (
        <RootStack.Screen name="Auth" component={AuthTabNavigator} />
      )}
    </RootStack.Navigator>
  );
}
