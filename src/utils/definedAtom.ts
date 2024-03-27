import { WritableAtom, atom } from "jotai";

const message = "unexpected undefined value";

export function definedAtom<T, U extends unknown[], V>(
  a: WritableAtom<T | undefined, U, V>,
  or: T,
) {
  return atom(
    (get) => {
      const r = get(a);
      if (r === undefined) {
        if (__DEV__) {
          throw new Error(message);
        }
        console.error(message);
        return or;
      }
      return r;
    },
    (_get, set, ...values: U) => set(a, ...values),
  );
}
