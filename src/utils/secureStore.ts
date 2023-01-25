import * as SecureStore from 'expo-secure-store';

export async function getSecureItem(key: string): Promise<string | null> {
  const value = await SecureStore.getItemAsync(key);
  return value ? value : null;
}

export async function setSecureItem(key: string, value: string): Promise<void> {
  return SecureStore.setItemAsync(key, value);
}
export async function removeSecureItem(key: string): Promise<void> {
  return SecureStore.deleteItemAsync(key);
}
