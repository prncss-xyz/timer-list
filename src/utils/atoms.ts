import { Atom, WritableAtom, atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

function insideAtom<Value, Args extends unknown[], Result>(
  resolvedAtomAtom: Atom<WritableAtom<Value, Args, Result>>,
) {
  return atom(
    (get) => get(get(resolvedAtomAtom)),
    (get, set, ...params: Args) => set(get(resolvedAtomAtom), ...params),
  );
}

export function resolvedAtom<Reference, Value, Args extends unknown[], Result>(
  referenceAtom: Atom<Reference>,
  valueFactory: (reference: Reference) => WritableAtom<Value, Args, Result>,
) {
  return insideAtom(atom((get) => valueFactory(get(referenceAtom))));
}

// https://jotai.org/docs/utilities/storage
export function atomWtihStorageValidated<T>(
  key: string,
  init: T,
  validate: (raw: unknown) => T | undefined,
) {
  return atomWithStorage(key, init, {
    getItem(key, initialValue) {
      const storedValue = localStorage.getItem(key);
      if (storedValue === null) {
        return initialValue;
      }
      return validate(JSON.parse(storedValue)) ?? initialValue;
    },
    setItem(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    removeItem(key) {
      localStorage.removeItem(key);
    },
    subscribe(key, callback, initialValue) {
      if (
        typeof window === "undefined" ||
        typeof window.addEventListener === "undefined"
      ) {
        return () => {};
      }
      const handleStorage = (e: StorageEvent) => {
        if (e.storageArea === localStorage && e.key === key) {
          callback(validate(JSON.parse(e.newValue ?? "")) ?? initialValue);
        }
      };
      window.addEventListener("storage", handleStorage);
      return () => {
        window.removeEventListener("storage", handleStorage);
      };
    },
  });
}
