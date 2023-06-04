import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getItem(key: string): Promise<string | null> {
  const value = await AsyncStorage.getItem(key);
  return value;
}

export async function setItem(key: string, value: string): Promise<void> {
  return AsyncStorage.setItem(key, value);
}
export async function removeItem(key: string): Promise<void> {
  return AsyncStorage.removeItem(key);
}

export default {
  getItem,
  setItem,
  removeItem,
};
