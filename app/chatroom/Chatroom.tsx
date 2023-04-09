import { useCallback, useEffect, useState, useMemo } from 'react';
import {
  useNavigation,
  NavigationProp,
  RouteProp,
  useRoute,
} from '@react-navigation/native';
import { StyleSheet, Image } from 'react-native';
import { Badge, MD3Theme, Text, useTheme } from 'react-native-paper';
import { GiftedChat } from 'react-native-gifted-chat';
import { View } from '@/components/Themed';
import { RootStackParams } from '@/routes/params';

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
  });
}

export default function Chat() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyle(theme), [theme]);
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const route = useRoute<RouteProp<RootStackParams, 'ChatRoom'>>();
  const [messages, setMessages] = useState([]);

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

  useEffect(() => {
    navigation.setOptions({
      headerTintColor: styles.text.color,
      headerTitleStyle: styles.text,
      title: chat.name,
      headerRight,
      headerBackground,
    });
  }, [chat, headerRight, navigation, headerBackground, styles]);

  const onSend = useCallback((msg = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, msg));
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
