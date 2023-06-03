import { getAlbumsAsync, Album, getAssetsAsync } from 'expo-media-library';

import {
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
  ImagePickerOptions,
} from 'expo-image-picker';
import { Media } from '@/types/gallery';

export async function listAlbums(): Promise<Album[]> {
  const albums = await getAlbumsAsync({
    includeSmartAlbums: true,
  }).then((res) => res.sort((a, b) => b.assetCount - a.assetCount));

  return albums;
}

export async function loadAlbumGallery(
  albumId: string,
  gallery?: Media[],
): Promise<Media[]> {
  const medias = await getAssetsAsync({
    first: 16,
    album: albumId,
    after: gallery?.length.toString(),
  });

  return medias.assets.map((asset) => ({
    id: asset.id,
    name: asset.filename,
    type: asset.mediaType,
    uri: asset.uri,
  }));
}

const imagePickerOptions: ImagePickerOptions = {
  allowsEditing: true,
  aspect: [1, 1],
  quality: 1,
  mediaTypes: MediaTypeOptions.Images,
};

export async function launchMediaPicker(
  picker: 'camera' | 'library',
): Promise<Media | null> {
  const mediaPicker =
    picker === 'camera' ? launchCameraAsync : launchImageLibraryAsync;
  const image = await mediaPicker(imagePickerOptions);
  if (image.canceled) return null;

  const res: Media = {
    id: image.assets[0].assetId || `prox-${new Date().toISOString()}`,
    name: image.assets[0].fileName || `prox-${new Date().toISOString()}`,
    type: image.assets[0].type || 'image',
    uri: image.assets[0].uri,
  };
  return res;
}
