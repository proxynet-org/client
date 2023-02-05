import { View } from 'components/themed';
import i18n from 'languages';
import { useEffect, useState, useCallback } from 'react';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import { Layout } from 'static';

type Message = {
  _id: number;
  text: string;
  createdAt: Date;
  user: {
    _id: number;
    name: string;
    avatar: string;
  };
};

export function ChatView() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://picsum.photos/50',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages: Message[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  return (
    <View
      style={{
        height: Layout.screen.height / 2,
        width: '100%',
        backgroundColor: 'transparent',
        borderWidth: 5,
        borderColor: 'red',
      }}
    >
      <GiftedChat
        infiniteScroll
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
        placeholder={i18n.t('chat.placeholder')}
        renderSend={(props) => (
          <Send {...props} label={i18n.t('chat.button')} />
        )}
        renderAvatar={() => null}
      />
    </View>
  );
}
