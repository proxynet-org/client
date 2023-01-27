import { useEffect, useState } from 'react';
import { Text, FAB, useTheme } from '@rneui/themed';
import { SafeAreaView, View } from 'components';
import { useToggleScreen, useAuth } from 'hooks';
import MapView, { Region } from 'react-native-maps';
import * as Location from 'expo-location';

import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';

export function MapScreen() {
  // const isFocused = useToggleScreen();
  const { signOut } = useAuth();
  const { theme } = useTheme();
  const [region, setRegion] = useState<Region>();
  const [errorMsg, setErrorMsg] = useState<string>();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const height = useSharedValue('50%');

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const style = useAnimatedStyle(() => {
    return {
      height: withTiming(height.value, config),
    };
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
      }}
    >
      <MapView
        region={region}
        onUserLocationChange={(e) => {
          if (!e.nativeEvent.coordinate) return;
          const { latitude, longitude } = e.nativeEvent.coordinate;
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        style={{ width: '100%', height: '100%' }}
        showsUserLocation
        followsUserLocation
        onTouchStart={() => {
          height.value = '5%';
        }}
      />
      <View
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          bottom: 0,
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          backgroundColor: 'transparent',
        }}
        pointerEvents="box-none"
      >
        <FAB
          icon={{ name: 'add', color: 'white' }}
          size="small"
          style={{ margin: 16 }}
          color={theme.colors.success}
        />
        <Animated.View
          style={[
            {
              width: '100%',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              backgroundColor: theme.colors.background,
            },
            style,
          ]}
          onTouchStart={() => {
            height.value = '50%';
          }}
        >
          <Text style={{ textAlign: 'center' }}>Chat</Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

// {isFocused && (
//   <View style={{ position: 'absolute' }}>
//     <Text>
//       {i18n.t('welcome')} {i18n.t('welcome')}
//     </Text>
//     <NavigationButton name="PreviewScreen" />
//     <NavigationButton name="CreateChatRoomScreen" />
//     <NavigationButton name="CreatePostScreen" />
//     <NavigationButton name="DirectMessagesScreen" />
//     <NavigationButton name="SettingsScreen" />
//     <Button title="Sign Out" onPress={signOut} />
//   </View>
// )}
