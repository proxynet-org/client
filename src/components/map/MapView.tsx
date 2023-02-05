import {
  useCallback,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import DefaultMapView, {
  Marker,
  MapMarkerProps,
  LatLng,
} from 'react-native-maps';
import * as Location from 'expo-location';
import { mapStyle } from 'styles';
import { Layout } from 'static';
import { getStoredItem, setStoredItem } from 'utils';
import { useAppState } from 'hooks';

type Props = {
  centerDuration?: number;
  onFollowChange?: (follow: boolean) => void;
  isLoading?: boolean;
};

export type MapViewHandle = {
  followUser: (centerDuration?: number) => Promise<unknown>;
  follow: boolean;
  setMarkers: (markers: Map<string, MapMarkerProps>) => void;
  addMarker: (id: string, marker: MapMarkerProps) => void;
  removeMarker: (id: string) => void;
};

export const MapView = forwardRef<MapViewHandle, Props>(
  ({ centerDuration = 1000, onFollowChange } = {}, ref) => {
    const [follow, setFollow] = useState(true);
    const [markers, setMarkers] = useState<Map<string, MapMarkerProps>>(
      new Map(),
    );
    const userLocation = useRef<LatLng>();
    useEffect(() => {
      onFollowChange?.(follow);
    }, [follow, onFollowChange]);

    const centerOnUser = useCallback(async function (centerDuration?: number) {
      let latitude: number;
      let longitude: number;

      if (userLocation.current) {
        latitude = userLocation.current.latitude;
        longitude = userLocation.current.longitude;
      } else {
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
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        followUser: (centerDuration) =>
          centerOnUser(centerDuration).then(() => setFollow(true)),
        follow,
        setMarkers,
        addMarker: (id, marker) => {
          setMarkers((markers) => {
            const newMarkers = new Map(markers);
            newMarkers.set(id, marker);
            return newMarkers;
          });
        },
        removeMarker: (id) => {
          setMarkers((markers) => {
            const newMarkers = new Map(markers);
            newMarkers.delete(id);
            return newMarkers;
          });
        },
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
        getStoredItem('lastLocation').then((storedUserLocation) => {
          if (storedUserLocation)
            userLocation.current = JSON.parse(storedUserLocation);
          centerOnUser();
        });
      })();
    }, [centerOnUser]);

    useAppState({
      onBackground: () => {
        if (userLocation.current) {
          setStoredItem('lastLocation', JSON.stringify(userLocation.current));
        }
      },
    });

    return (
      <DefaultMapView
        ref={mapViewRef}
        onUserLocationChange={(event) => {
          if (!event.nativeEvent.coordinate) return;
          const { latitude, longitude } = event.nativeEvent.coordinate;
          userLocation.current = { latitude, longitude };

          if (!follow) return;
          centerOnUser(centerDuration);
        }}
        onPanDrag={() => {
          setFollow(false);
        }}
        style={{
          width: Layout.screen.width,
          height: '100%',
          position: 'absolute',
        }}
        customMapStyle={mapStyle}
        // mapType="none"
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
      >
        {Array.from(markers.values()).map((marker, index) => (
          <Marker
            key={index}
            {...marker}
            onPress={(e) => {
              setFollow(false);
              marker.onPress?.(e);
            }}
          />
        ))}
      </DefaultMapView>
    );
  },
);

MapView.displayName = 'MapView';
