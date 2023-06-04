import { useCallback, useEffect, useMemo } from 'react';
import {
  useNavigation,
  NavigationProp,
  RouteProp,
  useRoute,
} from '@react-navigation/native';
import { StyleSheet, Image } from 'react-native';
import { Badge, MD3Theme, Text, useTheme } from 'react-native-paper';

import i18n from '@/languages';
import ChatView from '@/components/ChatView';
import { View } from '@/components/Themed';
import { RootStackParams } from '@/routes/params';
import { leaveChatroom } from '@/api/chatroom';
import positionSubject, { PositionObserver } from '@/events/PositionSubject';
import { distanceInMeters } from '@/utils/distanceInMeters';
import { RANGE_METERS } from '@/constants/rules';

function makeStyle(theme: MD3Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backdrop,
    },
    text: {
      color: theme.colors.background,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
      backgroundColor: 'transparent',
      gap: 5,
      marginRight: 10,
    },
    badge: { alignSelf: 'center', backgroundColor: 'green' },
    headerBackgroud: {
      flex: 1,
    },
    loader: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginLeft: -20,
      marginTop: -20,
    },
  });
}

export default function ChatRoom() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyle(theme), [theme]);
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const route = useRoute<RouteProp<RootStackParams, 'ChatRoom'>>();

  const { chatroom } = route.params;

  const headerRight = useCallback(() => {
    return (
      <View style={styles.headerRight}>
        <Text style={styles.text}>
          {i18n.t('chatroom.online', {
            count: chatroom.num_people,
          })}
        </Text>
        <Badge style={styles.badge} size={10} />
      </View>
    );
  }, [chatroom, styles]);

  const headerBackground = useCallback(() => {
    return (
      <Image source={{ uri: chatroom.image }} style={styles.headerBackgroud} />
    );
  }, [chatroom, styles]);

  useEffect(() => {
    navigation.setOptions({
      headerTintColor: styles.text.color,
      headerTitleStyle: styles.text,
      title: chatroom.name,
      headerRight,
      headerBackground,
    });

    return () => {
      leaveChatroom(chatroom.id);
    };
  }, [chatroom, headerRight, navigation, headerBackground, styles]);

  useEffect(() => {
    const positionObserver: PositionObserver = (position) => {
      const distance = distanceInMeters(position, chatroom.coordinates);
      if (distance > RANGE_METERS) {
        navigation.goBack();
      }
    };

    positionSubject.subscribe(positionObserver);

    return () => {
      positionSubject.unsubscribe(positionObserver);
    };
  }, [chatroom, navigation]);

  return (
    <ChatView
      chatEndpoint={`/chatrooms${chatroom.id}`}
      messagesEndpoint={`/chatrooms/${chatroom.id}/messages`}
    />
  );
}
