import { useCallback, useEffect, useState, useMemo } from 'react';
import {
  useNavigation,
  NavigationProp,
  RouteProp,
  useRoute,
} from '@react-navigation/native';
import { StyleSheet, Image } from 'react-native';
import {
  ActivityIndicator,
  Badge,
  MD3Theme,
  Text,
  useTheme,
} from 'react-native-paper';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { View } from '@/components/Themed';
import { RootStackParams } from '@/routes/params';
import { joinChatroom } from '@/api/chatroom';

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
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const { chat } = route.params;

  const headerRight = useCallback(() => {
    return (
      <View style={styles.headerRight}>
        <Text style={styles.text}>{chat.people} Online</Text>
        <Badge style={styles.badge} size={10} />
      </View>
    );
  }, [chat, styles]);

  const headerBackground = useCallback(() => {
    return (
      <Image source={{ uri: chat.media }} style={styles.headerBackgroud} />
    );
  }, [chat, styles]);

  const onSend = useCallback((msg: IMessage[]) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, msg));
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTintColor: styles.text.color,
      headerTitleStyle: styles.text,
      title: chat.name,
      headerRight,
      headerBackground,
    });
  }, [chat, headerRight, navigation, headerBackground, styles]);

  useEffect(() => {
    const onMessage = (message: string) => {
      const msg: IMessage = {
        _id: Math.random(),
        text: message,
        createdAt: new Date(),
        user: {
          _id: 0,
        },
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [msg]),
      );
    };

    const onOpen = () => {
      console.log('chatroom open hide loading');
      setLoading(false);
    };

    const onClose = () => {
      console.log('chatroom closed go back to map');
      navigation.goBack();
    };

    const { leaveChatroom } = joinChatroom(chat, onMessage, onOpen, onClose);

    return () => {
      leaveChatroom();
    };
  }, [navigation, chat]);

  return (
    <View style={styles.container}>
      <ActivityIndicator
        animating={loading}
        hidesWhenStopped
        size="large"
        style={styles.loader}
      />
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: 1,
        }}
      />
    </View>
  );
}
