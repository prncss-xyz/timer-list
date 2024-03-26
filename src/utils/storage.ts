import AsyncStorage from "@react-native-async-storage/async-storage";
import { PrimitiveAtom, atom } from "jotai";
import { atomEffect } from "jotai-effect";

import { getDebouncer } from "./debouncer";

type StorageOpts<T> = Partial<{
  debounceDelai: number;
  validate: (v: unknown) => T | undefined;
  normalize: (t: T) => T;
}>;

function loadData<T>(key: string, cb: (data: T) => void) {
  AsyncStorage.getItem(key).then((jsonValue) => {
    if (jsonValue === null) return;
    cb(JSON.parse(jsonValue));
  });
}

function saveData<T>(key: string, value: T) {
  const jsonValue = JSON.stringify(value);
  AsyncStorage.setItem(key, jsonValue);
}

enum Step {
  Init,
  Loading,
  Loaded,
}

// Jotai provides an AtomWithStorage utility; however it makes atoms async, which entails lots of complication
// later in the code, and prevents from using focusAtom; so we use this instead
function getStorageEffect<T>(
  key: string,
  dataAtom: PrimitiveAtom<T>,
  opts?: StorageOpts<T>,
) {
  let step = Step.Init;
  const validate = opts?.validate ?? ((t: unknown) => t as T);
  const save = getDebouncer((value: T) => {
    saveData(key, value);
  }, opts?.debounceDelai);
  return atomEffect((get, set) => {
    const data = get(dataAtom);
    switch (step) {
      case Step.Init:
        step = 1;
        loadData(key, (data) => {
          const validated = validate(data);
          if (validated !== undefined) set(dataAtom, validated);
          step = Step.Loaded;
        });
        break;
      case Step.Loading:
        break;
      case Step.Loaded:
        save(data);
        break;
    }
  });
}

export function getStorageAtom<T>(
  init: T,
  key: string,
  opts?: StorageOpts<T> | undefined,
) {
  const dataAtom = atom(init);
  const normalize = opts?.normalize ?? ((t) => t);
  const storageEffect = getStorageEffect(key, dataAtom, opts);
  return atom(
    (get) => {
      get(storageEffect);
      return get(dataAtom);
    },
    (_get, set, value: T) => set(dataAtom, normalize(value)),
  );
}
