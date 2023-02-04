import { useRef, useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { Dialog, FAB, useTheme } from '@rneui/themed';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MapMarkerProps } from 'react-native-maps';

import {
  SafeAreaView,
  MapView,
  MapViewHandle,
  ChatView,
  FABGroup,
  FabGroupHandle,
} from 'components';
import { RootStackParams } from 'navigation';
import { MapMarker } from 'types';
import { useQuery } from 'react-query';
import { useAuth, useRefetchOnFocus, useWebSocket } from 'hooks';

const markerIcons = {
  post: require('assets/images/map_icons/post.png'),
  forum: require('assets/images/map_icons/chat.png'),
};

const markers: MapMarker[] = [
  {
    id: '0',
    coordinate: { latitude: 48.825, longitude: 2.37 },
    type: 'post',
    img: 'https://picsum.photos/500',
    title: 'Post title',
  },
  {
    id: '1',
    coordinate: { latitude: 48.825, longitude: 2.39 },
    type: 'forum',
    img: 'https://picsum.photos/500',
    title: 'Forum title',
  },
];

export function MapScreen() {
  const { theme } = useTheme();
  const { signOut } = useAuth();
  const { addCallback, removeCallback } = useWebSocket();
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const mapViewRef = useRef<MapViewHandle>(null);
  const fabGroupRef = useRef<FabGroupHandle>(null);

  const toMarkerProps = useCallback(
    (marker: MapMarker): [string, MapMarkerProps] => {
      const { coordinate, type, id } = marker;
      return [
        id,
        {
          icon: markerIcons[type],
          coordinate,
          onPress: () => navigation.navigate('PreviewScreen', { marker }),
        },
      ];
    },
    [navigation],
  );

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['posts', 'chatRooms'],
    queryFn: () =>
      new Promise<MapMarker[]>((resolve) =>
        setTimeout(() => resolve(markers), 1000),
      ),
    onSuccess(data) {
      mapViewRef.current?.setMarkers(new Map(data.map(toMarkerProps)));
    },
  });

  useEffect(() => {
    function addMarker(marker: MapMarker) {
      mapViewRef.current?.addMarker(marker.id, toMarkerProps(marker)[1]);
    }
    function deleteMarker(id: string) {
      mapViewRef.current?.removeMarker(id);
    }
    addCallback('newPost', addMarker);
    addCallback('newChatRoom', addMarker);
    addCallback('delPost', deleteMarker);
    addCallback('delChatRoom', deleteMarker);
    return () => {
      removeCallback('newPost', addMarker);
      removeCallback('newChatRoom', addMarker);
      removeCallback('delPost', deleteMarker);
      removeCallback('delChatRoom', deleteMarker);
    };
  }, [addCallback, removeCallback, toMarkerProps]);

  useRefetchOnFocus(refetch);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: 'column-reverse',
      }}
    >
      <Dialog isVisible={isLoading}>
        <Dialog.Loading />
      </Dialog>
      <MapView ref={mapViewRef} />
      <ChatView />
      <View
        style={{
          width: '100%',
          borderWidth: 1,
          borderColor: 'blue',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <FAB
          title="Chat"
          icon={{ name: 'message', color: 'white', type: 'material-community' }}
          size="small"
          color={theme.colors.success}
          titleStyle={{ color: 'white' }}
        />
        <FAB
          icon={{
            name: 'crosshairs-gps',
            color: 'white',
            type: 'material-community',
          }}
          size="small"
          color={theme.colors.success}
          onPress={() => mapViewRef.current?.followUser()}
        />
        <FABGroup
          fab={{
            icon: { name: 'plus', color: 'white', type: 'material-community' },
            size: 'large',
            color: theme.colors.success,
          }}
          fabs={[
            {
              icon: {
                name: 'forum',
                color: 'white',
                type: 'material-community',
              },
              size: 'small',
              color: theme.colors.success,
              onPress: () => navigation.navigate('CreateChatRoomScreen'),
            },
            {
              icon: {
                name: 'camera',
                color: 'white',
                type: 'material-community',
              },
              size: 'small',
              color: theme.colors.success,
              onPress: () => navigation.navigate('CreatePostScreen'),
            },
          ]}
          direction="column-reverse"
          space={theme.spacing.sm}
        />
      </View>
      <FAB
        icon={{ name: 'cog', color: 'white', type: 'material-community' }}
        size="small"
        color={theme.colors.success}
        style={{
          position: 'absolute',
          top: 2 * theme.spacing.xl,
          right: theme.spacing.sm,
        }}
        onPress={() => navigation.navigate('SettingsScreen')}
      />
      <FAB
        icon={{ name: 'logout', color: 'white', type: 'material-community' }}
        size="small"
        color={theme.colors.success}
        style={{
          position: 'absolute',
          top: 2 * theme.spacing.xl,
          left: theme.spacing.sm,
        }}
        onPress={signOut}
      />
    </SafeAreaView>
  );
}
