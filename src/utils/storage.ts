import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";

import { getDebouncer } from "./debouncer";

export function atomWithNativeStorage<T>(
  init: T,
  key: string,
  debounceDelai = 1,
) {
  const dataAtom = atom(init);
  dataAtom.onMount = (setAtom) => {
    AsyncStorage.getItem(key).then(
      (jsonValue) => jsonValue !== null && setAtom(JSON.parse(jsonValue)),
    );
  };
  const debouncer = getDebouncer(debounceDelai, async (value: T) => {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  });
  return atom(
    (get) => get(dataAtom),
    (_get, set, value: T) => {
      debouncer(value);
      set(dataAtom, value);
    },
  );
}
