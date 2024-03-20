import { atom, WritableAtom, useAtom } from "jotai";
import { useMemo } from "react";

export function activateAtom<T, U extends T, V>(
  value: T,
  inputAtom: WritableAtom<U, T[], V>,
) {
  return atom(
    (get) => get(inputAtom) === value,
    (_get, set) => set(inputAtom, value),
  );
}

export function useActivateAtom<T, U extends T, V>(
  value: T,
  inputAtom: WritableAtom<U, T[], V>,
) {
  return useAtom(
    useMemo(() => activateAtom(value, inputAtom), [value, inputAtom]),
  );
}
