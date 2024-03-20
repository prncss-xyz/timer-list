import AsyncStorage from "@react-native-async-storage/async-storage";

// can throw an error
export async function saveData(key: string, value: unknown) {
  const jsonValue = JSON.stringify(value);
  await AsyncStorage.setItem(key, jsonValue);
}

// can throw an error
export async function loadData(key: string) {
  const jsonValue = await AsyncStorage.getItem(key);
  return jsonValue != null ? JSON.parse(jsonValue) : null;
}
