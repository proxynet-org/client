import { useMemo, useCallback, useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { MD3Theme, useTheme } from 'react-native-paper';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { View } from '@/components/Themed';
import connectToChat from '@/api/chat';

function makeStyle(theme: MD3Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backdrop,
    },
  });
}

export default function Chat() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyle(theme), [theme]);
  const [messages, setMessages] = useState<IMessage[]>([]);

  const onSend = useCallback((msg: IMessage[]) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, msg));
  }, []);

  useEffect(() => {
    const { disconnect } = connectToChat((message: string) => {
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
    });

    return () => {
      disconnect();
    };
  }, []);

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(msg) => onSend(msg)}
        user={{
          _id: 1,
        }}
      />
    </View>
  );
}
