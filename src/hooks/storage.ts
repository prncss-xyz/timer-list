import AsyncStorage from "@react-native-async-storage/async-storage";
import { PrimitiveAtom, useAtomValue, useSetAtom } from "jotai";
import { atomEffect } from "jotai-effect";
import { useEffect, useMemo, useRef, useState } from "react";

import { getDebouncer } from "@/utils/debouncer";

const debounceDelai = 500;

async function loadData(key: string) {
  const jsonValue = await AsyncStorage.getItem(key);
  if (jsonValue === null) return undefined;
  /* return JSON.parse(jsonValue); */
  return undefined
}

function saveData(key: string, value: unknown) {
  const jsonValue = JSON.stringify(value);
  AsyncStorage.setItem(key, jsonValue);
}

export function useStorageAtom<T>(
  key: string,
  dataAtom: PrimitiveAtom<T>,
  validate: (v: unknown) => T | undefined,
) {
  const debouncedSaveData = useMemo(
    () => getDebouncer((value: T) => saveData(key, value), debounceDelai),
    [key],
  );
  const setData = useSetAtom(dataAtom);
  const [resolved, setResolved] = useState(false);
  const first = useRef(true);
  // we will return this as a promise starting with reat 19
  useEffect(() => {
    loadData(key).then((data) => {
      setResolved(true);
      if (data === undefined) return;
      const validated = validate(data);
      if (validated === undefined) return;
      setData(validated);
    });
  }, [key, validate, setData]);
  const effect = useMemo(
    () =>
      atomEffect((get) => {
        if (!resolved) return;
        const data = get(dataAtom);
        // this avoids saving data that has just been loaded
        if (first.current) {
          first.current = false;
          return;
        }
        debouncedSaveData(data);
      }),
    [debouncedSaveData, dataAtom, resolved, first],
  );
  useAtomValue(effect);
  return resolved;
}
