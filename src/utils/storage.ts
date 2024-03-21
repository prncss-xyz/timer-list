import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";

import { getDebouncer } from "./debouncer";

type AtomWithNativeStorageOpts<T> = Partial<{
  debounceDelai: number;
  validate: (v: unknown) => T;
}>;

export function atomWithNativeStorage<T>(
  init: T,
  key: string,
  opts?: AtomWithNativeStorageOpts<T>,
) {
  const dataAtom = atom(init);
  dataAtom.onMount = (setAtom) => {
    AsyncStorage.getItem(key).then((jsonValue) => {
      if (jsonValue === null) return;
      const parsed = JSON.parse(jsonValue);
      const res = opts?.validate ? opts.validate(parsed) : parsed;
      return setAtom(res);
    });
  };
  const debouncer = getDebouncer(async (value: T) => {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  }, opts?.debounceDelai);
  return atom(
    (get) => get(dataAtom),
    (_get, set, value: T) => {
      debouncer(value);
      set(dataAtom, value);
    },
  );
}
