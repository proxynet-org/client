import { useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FAB } from 'react-native-paper';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

import { View } from '@/components/Themed';
import FabGroup from '@/components/FabGroup';
import MapView from '@/components/MapView';

import { RootStackParams } from '@/routes/params';

import { Publication } from '@/types/publications';
import { Chatroom } from '@/types/chatroom';

import { getPublications, subscribePublications } from '@/api/publication';
import { getChatrooms, subscribeChatrooms } from '@/api/chatroom';

function makeStyles(insets: EdgeInsets) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    settingsButton: {
      position: 'absolute',
      margin: 16,
      top: insets.top,
      right: insets.right,
    },
    chatButton: {
      position: 'absolute',
      margin: 16,
      bottom: insets.bottom,
      left: insets.left,
    },
  });
}

export default function MapScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(insets), [insets]);

  const [publications, setPublications] = useState<Map<string, Publication>>(
    new Map(),
  );
  const [chatrooms, setChatrooms] = useState<Map<string, Chatroom>>(new Map());

  useEffect(() => {
    async function fetchPublications() {
      const { data } = await getPublications();
      const newPublications = new Map<string, Publication>();
      data.forEach((publication: Publication) => {
        newPublications.set(publication.id, publication);
      });
      setPublications(newPublications);
    }

    async function fetchChatrooms() {
      const { data } = await getChatrooms();
      const newChatrooms = new Map<string, Chatroom>();
      data.forEach((chatroom: Chatroom) => {
        newChatrooms.set(chatroom.id, chatroom);
      });
      setChatrooms(newChatrooms);
    }

    fetchPublications();
    fetchChatrooms();

    const onNewPublication = (publication: Publication) => {
      setPublications((prev) => {
        const newPublications = new Map(prev);
        newPublications.set(publication.id, publication);
        return newPublications;
      });
    };

    const onNewChatroom = (chatroom: Chatroom) => {
      setChatrooms((prev) => {
        const newChatrooms = new Map(prev);
        newChatrooms.set(chatroom.id, chatroom);
        return newChatrooms;
      });
    };

    const { unsubscribePublications } = subscribePublications(onNewPublication);
    const { unsubscribeChatrooms } = subscribeChatrooms(onNewChatroom);

    return () => {
      unsubscribePublications();
      unsubscribeChatrooms();
    };
  }, []);

  const markers = useMemo(
    () => [
      ...Array.from(publications.values()).map((publication) => ({
        id: `publication_${publication.id}`,
        coordinates: publication.coordinates,
        icon: require('@/assets/images/map-marker/publication.png'),
        onPress: () =>
          navigation.navigate('PublicationPreview', {
            publication,
          }),
      })),
      ...Array.from(chatrooms.values()).map((chatroom) => ({
        id: `chatroom_${chatroom.id}`,
        coordinates: chatroom.coordinates,
        icon: require('@/assets/images/map-marker/chatroom.png'),
        onPress: () => navigation.navigate('ChatPreview', { chatroom }),
      })),
    ],
    [publications, chatrooms, navigation],
  );

  return (
    <View style={styles.container}>
      <MapView markers={markers} />
      <FAB
        icon="cog"
        onPress={() => navigation.navigate('Settings')}
        size="small"
        style={styles.settingsButton}
      />
      <FabGroup
        icon={(open) => (open ? 'close' : 'plus')}
        actions={[
          {
            icon: 'forum',
            onPress: () => navigation.navigate('ChatCreate'),
            label: 'Chatroom',
          },
          {
            icon: 'camera',
            onPress: () => navigation.navigate('PublicationCreate'),
            label: 'Publication',
          },
        ]}
      />
      <FAB
        icon="message"
        onPress={() => navigation.navigate('Chat')}
        size="small"
        style={styles.chatButton}
      />
    </View>
  );
}
