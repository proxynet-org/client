import { useMemo, useState, useEffect } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { ActivityIndicator, MD3Theme, useTheme } from 'react-native-paper';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { View } from '@/components/Themed';
import { connectToChat } from '@/api/chat';
import { RootStackParams } from '@/routes/params';
import { useAuth } from '@/contexts/AuthContext';
import { ChatMessage } from '@/types/chat';

function makeStyle(theme: MD3Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backdrop,
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

let onSend = (message: IMessage[]) => {
  console.log('send message', message);
};

function ChatMessageToIMessage(message: ChatMessage): IMessage {
  return {
    ...message,
    _id: message.id,
    createdAt: new Date(message.created_at),
    user: {
      _id: message.user,
    },
  };
}

export default function Chat() {
  const { user } = useAuth();
  const theme = useTheme();
  const styles = useMemo(() => makeStyle(theme), [theme]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onMessage = (message: ChatMessage) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [ChatMessageToIMessage(message)]),
      );
    };

    const onOpen = async (initialMessages: ChatMessage[]) => {
      console.log('connected to chat hide loading');
      setLoading(false);
      setMessages(initialMessages.reverse().map(ChatMessageToIMessage));
    };

    const onClose = () => {
      console.log('disconnected from go back to map');
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    };

    const { disconnect, sendMessage } = connectToChat(
      onMessage,
      onOpen,
      onClose,
    );

    onSend = (msg) => {
      sendMessage({
        text: msg[0].text,
      });
    };

    return () => {
      disconnect();
    };
  }, [navigation]);

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator
        animating={loading}
        hidesWhenStopped
        size="large"
        style={styles.loader}
      />
      <GiftedChat
        showUserAvatar={false}
        renderAvatar={() => null}
        messages={messages}
        onSend={onSend}
        user={{
          _id: user.id,
        }}
      />
    </View>
  );
}
