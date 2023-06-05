import { BASE_URL_WS } from '@env';
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
import { joinChatroom } from '@/api/chatroom';
import { SnackbarState } from '@/types/ui';
import positionSubject, { PositionObserver } from '@/events/PositionSubject';
import { distanceInMeters } from '@/utils/distanceInMeters';
import { RANGE_METERS } from '@/constants/rules';
import { parseWebSocketMessage } from '@/utils/websocket';

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
    const ws = new WebSocket(`${BASE_URL_WS}/chatrooms${chatroom.id}/`);
    ws.onmessage = (event) => {
      const data = parseWebSocketMessage(event);
      if (data) {
        switch (data.type) {
          case 'join':
            setUpdatedChatroom((prev) => ({
              ...prev,
              num_people: prev.num_people + 1,
            }));
            break;
          case 'leave':
            setUpdatedChatroom((prev) => ({
              ...prev,
              num_people: prev.num_people - 1,
            }));
            break;
          default:
            break;
        }
      }
    };
    return ws.close;
  }, [chatroom]);

  const enterChatroom = async () => {
    try {
      if (!chatroom.joined) {
        await joinChatroom(chatroom.id);
      }
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

  const full = updatedChatroom.num_people >= chatroom.capacity;

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
                {i18n.t('chatroom.verified')}
              </Chip>
            </View>
          }
          subtitle={
            <View style={styles.subTitle}>
              <Badge
                size={10}
                style={{
                  backgroundColor: full ? theme.colors.error : 'green',
                  alignSelf: 'center',
                }}
              />
              <Text>
                {full
                  ? i18n.t('chatroom.full')
                  : i18n.t('chatroom.online', {
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
            disabled={full}
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
