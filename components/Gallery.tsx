import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { Button, IconButton, Menu } from 'react-native-paper';
import { FlatGrid } from 'react-native-super-grid';
import { requestPermissionsAsync, Album } from 'expo-media-library';

import useToggle from '@/hooks/useToggle';

import { View } from './Themed';
import dimensions from '@/constants/dimensions';
import {
  launchMediaPicker,
  listAlbums,
  loadAlbumGallery,
} from '@/utils/gallery';
import { Media } from '@/types/gallery';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  menuContent: {
    height: 250,
  },
});

type GalleryProps = {
  value: Media | undefined;
  onChange: (image: Media) => void;
};

export default function Gallery({ onChange, value }: GalleryProps) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [albumIndex, setAlbumIndex] = useState<number>(0);
  const [menuOpen, toggleMenu] = useToggle(false);
  const [gallery, setGallery] = useState<Media[]>([]);

  useEffect(() => {
    (async () => {
      const { granted } = await requestPermissionsAsync();
      if (!granted) {
        return;
      }

      const rawAlbums = await listAlbums();
      if (!rawAlbums.length) return;
      setAlbums(rawAlbums);

      const medias = await loadAlbumGallery(rawAlbums[0].id);
      if (!medias.length) return;
      setGallery(medias);

      onChange(medias[0]);
    })();
  }, [onChange]);

  const selectedAlbum = useMemo(() => albums[albumIndex], [albums, albumIndex]);

  const loadMore = useCallback(async () => {
    const nextMedias = await loadAlbumGallery(selectedAlbum.id, gallery);
    setGallery([...gallery, ...nextMedias]);
  }, [selectedAlbum, gallery]);

  const selectAlbum = useCallback(
    async (index: number) => {
      setAlbumIndex(index);
      const medias = await loadAlbumGallery(albums[index].id);
      setGallery(medias);
      toggleMenu();
    },
    [albums, toggleMenu],
  );

  const onCameraPress = useCallback(async () => {
    const res = await launchMediaPicker('camera');
    if (!res) return;
    onChange(res);
  }, [onChange]);

  const onLibraryPress = useCallback(async () => {
    toggleMenu();
    const res = await launchMediaPicker('library');
    if (!res) return;
    onChange(res);
  }, [onChange, toggleMenu]);

  const GalleryItem = useCallback(
    ({ item }: { item: Media }) => {
      return (
        <TouchableOpacity onPress={() => onChange(item)}>
          <Image style={styles.image} source={{ uri: item.uri }} />
        </TouchableOpacity>
      );
    },
    [onChange],
  );

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{ uri: value?.uri || 'https://picsum.photos/500' }}
      />
      <View style={styles.row}>
        <Menu
          visible={menuOpen}
          onDismiss={toggleMenu}
          anchor={
            <Button
              onPress={toggleMenu}
              icon={menuOpen ? 'chevron-up' : 'chevron-down'}
            >
              {selectedAlbum?.title || 'Select album'}
            </Button>
          }
          contentStyle={styles.menuContent}
        >
          <FlatList
            data={[...albums, { title: 'Open library', id: 'library' }]}
            renderItem={({ item, index }) => (
              <Menu.Item
                {...item}
                onPress={() => {
                  if (item.id === 'library') {
                    onLibraryPress();
                  } else {
                    selectAlbum(index);
                  }
                }}
              />
            )}
          />
        </Menu>
        <IconButton icon="camera" size={24} onPress={onCameraPress} />
      </View>
      <FlatGrid
        data={gallery}
        keyExtractor={(item) => item?.id}
        itemDimension={dimensions.window.width / 5}
        spacing={1}
        renderItem={GalleryItem}
        onEndReached={loadMore}
      />
    </View>
  );
}
