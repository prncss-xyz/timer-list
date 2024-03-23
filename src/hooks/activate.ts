import { atom, WritableAtom, useAtom } from "jotai";
import { useMemo } from "react";

export function activateAtom<T, V>(
  value: T,
  inputAtom: WritableAtom<T, [T], V>,
) {
  return atom(
    (get) => get(inputAtom) === value,
    (_get, set) => set(inputAtom, value),
  );
}

export function useActivateAtom<T, V>(
  value: T,
  inputAtom: WritableAtom<T, [value: T], V>,
) {
  return useAtom(
    useMemo(() => activateAtom(value, inputAtom), [value, inputAtom]),
  );
}
