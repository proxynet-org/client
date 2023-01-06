import React, { useState, useEffect } from 'react';
import MapView, { Region } from 'react-native-maps';
import { StyleSheet, View, Dimensions } from 'react-native';
import { RootTabScreenProps } from 'navigation/types';
import { requestForegroundPermissionsAsync } from 'expo-location';

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<'TabOne'>) {
  const [region, setRegion] = useState<Region>();

  useEffect(() => {
    (async () => {
      const res = await requestForegroundPermissionsAsync();
      console.log(res);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation
        followsUserLocation
        onUserLocationChange={(event) => {
          if (event.nativeEvent.coordinate) {
            setRegion({
              latitude: event.nativeEvent.coordinate.latitude,
              longitude: event.nativeEvent.coordinate.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.0005,
            });
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
