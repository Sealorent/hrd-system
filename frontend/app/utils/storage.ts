// /utils/storage.ts
import { StorageKeys } from './storageKeys';

class StorageService {
  setItem(key: StorageKeys | keyof typeof StorageKeys, value: any) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error setting item in localStorage: ${error}`);
    }
  }

  getItem(key: StorageKeys | keyof typeof StorageKeys) {
    try {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) {
        return null;
      }
      return JSON.parse(serializedValue);
    } catch (error) {
    //   console.error(`Error getting item from localStorage: ${error}`);
      return null;
    }
  }

  removeItem(key: StorageKeys | keyof typeof StorageKeys) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage: ${error}`);
    }
  }

  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error(`Error clearing localStorage: ${error}`);
    }
  }
}

export const storage = new StorageService();
