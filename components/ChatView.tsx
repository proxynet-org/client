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

let onSend: (msg: IMessage[]) => void;

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

type Props = {
  chatEndpoint: string;
  messagesEndpoint: string;
};

export default function ChatView({ chatEndpoint, messagesEndpoint }: Props) {
  const { user } = useAuth();
  const theme = useTheme();
  const styles = useMemo(() => makeStyle(theme), [theme]);
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const [connecting, setConnecting] = useState(true);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    function onMessage(message: ChatMessage) {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [ChatMessageToIMessage(message)]),
      );
    }

    function onOpen() {
      setConnecting(false);
    }

    function onClose() {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }

    const { getMessages, disconnect, sendMessage } = connectToChat(
      chatEndpoint,
      messagesEndpoint,
      onMessage,
      onOpen,
      onClose,
    );

    async function fetchMessages() {
      const { data } = await getMessages();
      setMessages(data.map(ChatMessageToIMessage).reverse());
      setLoading(false);
    }

    fetchMessages();

    onSend = (msg) => {
      sendMessage({
        text: msg[0].text,
      });
    };

    return disconnect;
  }, [navigation, chatEndpoint, messagesEndpoint]);

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
        textInputProps={{
          disabled: connecting,
        }}
      />
    </View>
  );
}
