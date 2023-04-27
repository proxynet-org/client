import { useMemo, useCallback, useState, useEffect } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { ActivityIndicator, MD3Theme, useTheme } from 'react-native-paper';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { View } from '@/components/Themed';
import { connectToChat } from '@/api/chat';
import { RootStackParams } from '@/routes/params';

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

export default function Chat() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyle(theme), [theme]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const [loading, setLoading] = useState(true);

  const onSend = useCallback((msg: IMessage[]) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, msg));
  }, []);

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
      console.log('connected to chat hide loading');
      setLoading(false);
    };

    const onClose = () => {
      console.log('disconnected from go back to map');
      navigation.goBack();
    };

    const { disconnect } = connectToChat(onMessage, onOpen, onClose);

    return () => {
      disconnect();
    };
  }, [navigation]);

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
        onSend={(msg) => onSend(msg)}
        user={{
          _id: 1,
        }}
      />
    </View>
  );
}
