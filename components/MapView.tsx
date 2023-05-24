import { useCallback, useEffect, useRef, useState } from 'react';
import { ImageURISource, StyleSheet } from 'react-native';
import DefaultMapView, {
  LatLng,
  Marker,
  Region,
  UserLocationChangeEvent,
} from 'react-native-maps';
import { FAB } from 'react-native-paper';
import {
  useForegroundPermissions,
  getCurrentPositionAsync,
} from 'expo-location';

import { updatePostion } from '@/api/map';
import mapstyle from '@/constants/mapstyle';
import dimensions from '@/constants/dimensions';

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    left: dimensions.window.width / 2 - 28,
    bottom: 0,
    borderRadius: 50,
  },
});

type Props = {
  markers: Array<{
    id: string;
    coordinate: LatLng;
    icon?: number | ImageURISource | undefined;
    onPress?: () => void;
  }>;
};

export default function MapView({ markers }: Props) {
  const [followUser, setFollowUser] = useState(true);
  const mapRef = useRef<DefaultMapView>(null);
  const userLocation = useRef<LatLng>();
  const timeout = useRef<NodeJS.Timeout>();

  const [status] = useForegroundPermissions({
    request: true,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      updatePostion({
        latitude: userLocation.current?.latitude || 0,
        longitude: userLocation.current?.longitude || 0,
      });
    }, 1000 * 10);
    return () => clearInterval(interval);
  }, []);

  const centerOnUser = useCallback(() => {
    if (!userLocation.current) {
      getCurrentPositionAsync({ accuracy: 6 }).then((location) => {
        if (!location.coords) return;
        const { latitude, longitude } = location.coords;
        userLocation.current = { latitude, longitude };
        centerOnUser();
      });
      return;
    }
    const region: Region = {
      latitude: userLocation.current.latitude,
      longitude: userLocation.current.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    mapRef.current?.animateToRegion(region, 1000);
  }, []);

  const cancelFollow = useCallback(() => {
    clearTimeout(timeout.current);
    timeout.current = undefined;
    if (followUser) {
      setFollowUser(false);
    }
  }, [followUser, setFollowUser]);

  const onPressFollow = useCallback(() => {
    if (!followUser) {
      centerOnUser();

      timeout.current = setTimeout(() => {
        setFollowUser(true);
      }, 1000);
    }
  }, [followUser, setFollowUser, centerOnUser]);

  const onUserLocationChange = useCallback(
    (ev: UserLocationChangeEvent) => {
      if (!ev.nativeEvent.coordinate) return;
      const { latitude, longitude } = ev.nativeEvent.coordinate;
      userLocation.current = { latitude, longitude };

      if (!followUser) return;
      centerOnUser();
    },
    [followUser, centerOnUser],
  );

  return (
    <>
      <DefaultMapView
        ref={mapRef}
        customMapStyle={mapstyle}
        style={styles.map}
        showsUserLocation={status?.granted}
        followsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        showsPointsOfInterest={false}
        showsBuildings={false}
        showsIndoorLevelPicker={false}
        showsIndoors={false}
        showsTraffic={false}
        toolbarEnabled={false}
        onPanDrag={cancelFollow}
        onUserLocationChange={onUserLocationChange}
      >
        {markers?.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            onPress={() => {
              marker.onPress?.();
              cancelFollow();
            }}
            image={marker.icon}
          />
        ))}
      </DefaultMapView>
      <FAB
        icon="crosshairs-gps"
        style={styles.fab}
        onPress={onPressFollow}
        size="small"
        visible={!followUser}
      />
    </>
  );
}
