import {
  useCallback,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import DefaultMapView from 'react-native-maps';
import * as Location from 'expo-location';
import { mapStyle } from 'styles';

type Props = {
  centerDuration?: number;
  onFollowChange?: (follow: boolean) => void;
};

export type MapViewHandle = {
  followUser: (
    latitude?: number,
    longitude?: number,
    centerDuration?: number,
  ) => Promise<unknown>;
  follow: boolean;
};

export const MapView = forwardRef<MapViewHandle, Props>(
  ({ centerDuration = 1000, onFollowChange } = {}, ref) => {
    const [follow, setFollow] = useState(true);

    useEffect(() => {
      onFollowChange?.(follow);
    }, [follow, onFollowChange]);

    const centerOnUser = useCallback(async function (
      latitude?: number,
      longitude?: number,
      centerDuration?: number,
    ) {
      if (!latitude || !longitude) {
        const location = await Location.getCurrentPositionAsync({});
        latitude = location.coords.latitude;
        longitude = location.coords.longitude;
      }
      const region = {
        latitude,
        longitude,
        latitudeDelta: 0.0461,
        longitudeDelta: 0.02105,
      };
      return new Promise((resolve) => {
        mapViewRef.current?.animateToRegion(region, centerDuration);
        setTimeout(() => {
          resolve(null);
        }, centerDuration);
      });
    },
    []);

    useImperativeHandle(
      ref,
      () => ({
        followUser: (latitude, longitude, centerDuration) =>
          centerOnUser(latitude, longitude, centerDuration).then(() =>
            setFollow(true),
          ),
        follow,
      }),
      [follow, centerOnUser],
    );

    const mapViewRef = useRef<DefaultMapView>(null);

    useEffect(() => {
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          // setErrorMsg('Permission to access location was denied');
          return;
        }

        centerOnUser();
      })();
    }, [centerOnUser]);

    return (
      <DefaultMapView
        ref={mapViewRef}
        onUserLocationChange={(event) => {
          if (!follow || !event.nativeEvent.coordinate) return;
          const { latitude, longitude } = event.nativeEvent.coordinate;
          centerOnUser(latitude, longitude, centerDuration);
        }}
        onPanDrag={() => {
          setFollow(false);
        }}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
        customMapStyle={mapStyle}
        mapType="none"
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
      />
    );
  },
);

MapView.displayName = 'MapView';
