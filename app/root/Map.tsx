import { useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FAB } from 'react-native-paper';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

import { View } from '@/components/Themed';
import FabGroup from '@/components/FabGroup';
import MapView from '@/components/MapView';

import { RootStackParams } from '@/routes/params';
import { Post } from '@/types/post';
import { Chatroom } from '@/types/chatroom';
import { openMap } from '@/api/map';
import { getPosts } from '@/api/post';

import useAxios from '@/hooks/useAxios';
import { getChatrooms } from '@/api/chatroom';

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
  const [postMarkers, setPostMarkers] = useState<Post[]>([]);
  const [chatroomMarkers, setChatroomMarkers] = useState<Chatroom[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(insets), [insets]);

  const { response: chatroomResponse } = useAxios<Chatroom[]>({
    axiosRequest: getChatrooms,
  });

  const { response: postResponse } = useAxios<Post[]>({
    axiosRequest: getPosts,
  });

  const markers = useMemo(
    () =>
      postResponse && chatroomResponse
        ? [
            ...postResponse.data.map((post) => ({
              id: post.id,
              coordinate: post.coordinates,
              icon: require('@/assets/images/map-marker/post.png'),
              onPress: () => navigation.navigate('PostPreview', { post }),
            })),
            ...chatroomResponse.data.map((chat) => ({
              id: chat.id,
              coordinate: chat.coordinates,
              icon: require('@/assets/images/map-marker/chat.png'),
              onPress: () => navigation.navigate('ChatPreview', { chat }),
            })),
            ...postMarkers.map((post) => ({
              id: post.id,
              coordinate: post.coordinates,
              icon: require('@/assets/images/map-marker/post.png'),
              onPress: () => navigation.navigate('PostPreview', { post }),
            })),
            ...chatroomMarkers.map((chat) => ({
              id: chat.id,
              coordinate: chat.coordinates,
              icon: require('@/assets/images/map-marker/chat.png'),
              onPress: () => navigation.navigate('ChatPreview', { chat }),
            })),
          ]
        : [],
    [postResponse, chatroomResponse, navigation, postMarkers, chatroomMarkers],
  );

  useEffect(() => {
    const onNewPost = (post: Post) => {
      setPostMarkers((prev) => [...prev, post]);
    };
    const onNewChatroom = (chatroom: Chatroom) => {
      setChatroomMarkers((prev) => [...prev, chatroom]);
    };

    const onOpen = () => {
      console.log('Map opened nothing to do here');
    };

    const onClose = () => {
      console.log('Map closed nothing to do here');
    };

    const { closeMap, sendPosition } = openMap(
      onNewPost,
      onNewChatroom,
      onOpen,
      onClose,
    );

    // Send position every 10 seconds
    const interval = setInterval(() => {
      sendPosition({
        latitude: 0,
        longitude: 0,
      });
    }, 10000);

    return () => {
      closeMap();
      clearInterval(interval);
    };
  }, []);

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
            onPress: () => navigation.navigate('PostCreate'),
            label: 'Post',
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
