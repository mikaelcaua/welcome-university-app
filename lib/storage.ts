import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

export const AUTH_STORAGE_KEY = 'welcome-university.auth';

export const zustandStorage = createJSONStorage(() => AsyncStorage);

export const storage = {
  getItem: AsyncStorage.getItem,
  setItem: AsyncStorage.setItem,
  removeItem: AsyncStorage.removeItem,
  getAllKeys: AsyncStorage.getAllKeys,
  multiRemove: (keys: readonly string[]) => Promise.all(keys.map((key) => AsyncStorage.removeItem(key))),
};
