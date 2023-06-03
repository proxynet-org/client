import { useMemo, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Badge,
  Card,
  MD3Theme,
  useTheme,
  Paragraph,
  Text,
  IconButton,
  Title,
  Chip,
  Snackbar,
} from 'react-native-paper';

import i18n from '@/languages';
import { View } from '@/components/Themed';
import { RootStackParams } from '@/routes/params';
import { getChatroom, joinChatroom } from '@/api/chatroom';
import { SnackbarState } from '@/types/ui';

function makeStyle(theme: MD3Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backdrop,
    },
    image: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
    title: {
      ...theme.fonts.titleLarge,
    },
    body: {
      ...theme.fonts.bodyLarge,
    },
    subTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
      backgroundColor: 'transparent',
      gap: 5,
    },
  });
}

export default function Preview() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyle(theme), [theme]);
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
  const route = useRoute<RouteProp<RootStackParams, 'ChatPreview'>>();
  const { chatroom } = route.params;

  const [updatedChatroom, setUpdatedChatroom] = useState(chatroom);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    type: 'error',
    duration: 3000,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      getChatroom(chatroom.id).then((lastChatroom) => {
        setUpdatedChatroom(lastChatroom.data);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [chatroom]);

  const enterChatroom = async () => {
    try {
      await joinChatroom(chatroom.id);
      navigation.replace('ChatRoom', { chatroom: updatedChatroom });
    } catch (err) {
      setSnackbar({
        open: true,
        message: i18n.t('chatroom.join.error'),
        type: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Cover source={{ uri: chatroom.image }} style={styles.image} />
        <Card.Title
          title={
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignContent: 'center',
                backgroundColor: 'transparent',
                gap: 5,
              }}
            >
              <Title>{chatroom.name}</Title>
              <Chip icon="check-decagram" mode="flat">
                verified
              </Chip>
            </View>
          }
          subtitle={
            <View style={styles.subTitle}>
              <Badge
                size={10}
                style={{
                  backgroundColor:
                    updatedChatroom.num_people >= chatroom.capacity
                      ? theme.colors.error
                      : 'green',
                  alignSelf: 'center',
                }}
              />
              <Text>
                {i18n.t('chatroom.online', {
                  count: updatedChatroom.num_people,
                })}
              </Text>
            </View>
          }
        />
        <Card.Content>
          <Paragraph>{chatroom.description}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <IconButton
            mode="contained-tonal"
            icon="message"
            onPress={enterChatroom}
            disabled={updatedChatroom.num_people >= chatroom.capacity}
          />
        </Card.Actions>
      </Card>
      <Snackbar
        visible={snackbar.open}
        onDismiss={() => setSnackbar({ ...snackbar, open: false })}
        action={{
          label: 'Close',
          onPress: () => setSnackbar({ ...snackbar, open: false }),
        }}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
}
