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
  const media = await mediaPicker(imagePickerOptions);
  if (media.canceled) return null;

  const res: Media = {
    id: media.assets[0].assetId || `prox-${new Date().toISOString()}`,
    name: media.assets[0].fileName || `prox-${new Date().toISOString()}`,
    type: media.assets[0].type || 'image',
    uri: media.assets[0].uri,
  };
  return res;
}
