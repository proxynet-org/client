import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getStoredItem(key: string): Promise<string | null> {
  return await AsyncStorage.getItem(key);
}

export async function setStoredItem(key: string, value: string): Promise<void> {
  return AsyncStorage.setItem(key, value);
}

export async function removeStoredItem(key: string): Promise<void> {
  return AsyncStorage.removeItem(key);
}

export async function clearStoredItems(): Promise<void> {
  return AsyncStorage.clear();
}

export async function getStoredKeys(): Promise<readonly string[]> {
  return AsyncStorage.getAllKeys();
}
