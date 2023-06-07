import { useCallback, useEffect, useRef, useState } from 'react';
import { Linking, StyleSheet, Alert } from 'react-native';
import DefaultMapView, {
  LatLng,
  Marker,
  Region,
  UserLocationChangeEvent,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import ClusteredMapView from 'react-native-map-clustering';
import { FAB, useTheme } from 'react-native-paper';
import {
  getCurrentPositionAsync,
  getForegroundPermissionsAsync,
  requestForegroundPermissionsAsync,
} from 'expo-location';

import asyncStore from '@/utils/asyncStore';
import mapstyle from '@/constants/mapstyle';
import dimensions from '@/constants/dimensions';
import { MapMarker } from '@/types/ui';
import { distanceInMeters } from '@/utils/distanceInMeters';
import positionSubject from '@/events/PositionSubject';
import i18n from '@/languages';

export const DISTANCE_METERS_TO_UPDATE = 1000;
const POSITION_KEY = 'position';

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
  markers: MapMarker[];
};

const INITIAL_REGION = {
  latitude: 48.8584,
  longitude: 2.2944,
  latitudeDelta: 8.5,
  longitudeDelta: 8.5,
};

export default function MapView({ markers }: Props) {
  const theme = useTheme();
  const [followUser, setFollowUser] = useState(true);
  const mapRef = useRef<DefaultMapView>(null);
  const userLocation = useRef<LatLng>();
  const timeout = useRef<NodeJS.Timeout>();
  const distance = useRef<number>(0);

  useEffect(() => {
    async function start() {
      const location = await asyncStore.getItem(POSITION_KEY);
      if (location) {
        const { latitude, longitude } = JSON.parse(location);
        userLocation.current = { latitude, longitude };
      }

      const { granted } = await getForegroundPermissionsAsync();

      if (!granted) {
        const res = await requestForegroundPermissionsAsync();
        if (!res.granted) {
          Alert.alert('', i18n.t('permissions.location.denied'), [
            {
              text: 'OK',
              onPress: async () => {
                await Linking.openSettings();
                setTimeout(() => {
                  start();
                }, 1000);
              },
            },
          ]);
          return;
        }
      }

      if (!location) {
        const position = await getCurrentPositionAsync({ accuracy: 6 });
        if (!position.coords) return;
        const { latitude, longitude } = position.coords;
        userLocation.current = { latitude, longitude };
      }

      if (!userLocation.current) {
        return;
      }

      positionSubject.notify(userLocation.current);
    }

    start();
  }, []);

  const centerOnUser = useCallback(async () => {
    if (!userLocation.current) {
      await getCurrentPositionAsync({ accuracy: 6 }).then((location) => {
        if (!location.coords) {
          return;
        }
        const { latitude, longitude } = location.coords;
        userLocation.current = { latitude, longitude };
        centerOnUser();
      });
      return;
    }
    const region: Region = {
      latitude: userLocation.current.latitude,
      longitude: userLocation.current.longitude,
      latitudeDelta: 0.0015,
      longitudeDelta: 0.0015,
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
    async (ev: UserLocationChangeEvent) => {
      if (!ev.nativeEvent.coordinate) {
        return;
      }
      const oldPosition = userLocation.current ?? ev.nativeEvent.coordinate;
      const newPosition = ev.nativeEvent.coordinate;

      userLocation.current = newPosition;
      await asyncStore.setItem(POSITION_KEY, JSON.stringify(newPosition));
      distance.current += distanceInMeters(oldPosition, newPosition);

      if (distance.current >= DISTANCE_METERS_TO_UPDATE) {
        positionSubject.notify(newPosition);
        distance.current = 0;
      }

      if (!followUser) {
        return;
      }

      centerOnUser();
    },
    [followUser, centerOnUser],
  );

  return (
    <>
      <ClusteredMapView
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        ref={mapRef}
        customMapStyle={mapstyle[theme.dark ? 'dark' : 'light']}
        style={styles.map}
        showsUserLocation
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
        onClusterPress={cancelFollow}
      >
        {markers
          ?.filter((marker) => marker.coordinates)
          .map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinates}
              onPress={() => {
                marker.onPress?.();
                cancelFollow();
              }}
              image={marker.icon}
            />
          ))}
      </ClusteredMapView>
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
