import * as SecureStore from "expo-secure-store";

export function useSecureStore() {
  const set = async (key: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(key, value);
  };

  const get = async (key: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(key);
  };

  const remove = async (key: string): Promise<void> => {
    await SecureStore.deleteItemAsync(key);
  };

  return { set, get, remove };
}