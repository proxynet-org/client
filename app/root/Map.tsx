import { useMemo } from 'react';
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
  });
}

export default function MapScreen() {
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
          ]
        : [],
    [postResponse, chatroomResponse, navigation],
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
            onPress: () => navigation.navigate('PostCreate'),
            label: 'Post',
          },
        ]}
      />
    </View>
  );
}
