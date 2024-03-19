import { Getter, PrimitiveAtom, Setter, atom } from "jotai";

import { eq, insert, nextValue, remove } from "./core";

export type IItem = { seconds: number };

const nullItem: IItem = { seconds: 0 };
const defaultTimerAtom = atom<IItem>(nullItem);
export type ItemAtom = typeof defaultTimerAtom;

export const itemsAtom = atom([defaultTimerAtom]);

export const currentItemAtom = atom(defaultTimerAtom);

export const getIsCurrentItemAtom = (itemAtom: ItemAtom) =>
  atom(
    (get) => get(currentItemAtom) === itemAtom,
    (_get, set) => set(currentItemAtom, itemAtom),
  );

export const getSecondsAtom = (itemAtom: ItemAtom) =>
  atom(
    (get) => get(itemAtom).seconds,
    (get, set, seconds: number) => set(itemAtom, { ...get(itemAtom), seconds }),
  );

export const currentItemSecondsAtom = atom(
  (get) => get(get(currentItemAtom)).seconds,
  (get, set, seconds: number) => {
    const itemAtom = get(currentItemAtom);
    return set(itemAtom, { ...get(itemAtom), seconds });
  },
);

export const insertItemAtom = atom(
  null,
  (get, set, pos: PrimitiveAtom<IItem>) => {
    const items = get(itemsAtom);
    const index = Math.max(
      0,
      items.findIndex((item) => item === pos),
    );
    const item = atom(get(pos));
    set(itemsAtom, insert(items, index, item));
  },
);

export const removeItemAtom = atom(
  null,
  (get, set, pos: PrimitiveAtom<IItem>) => {
    const items = get(itemsAtom);
    if (items.length === 1) {
      set(clearItemsAtom);
      return;
    }
    const index = Math.max(
      0,
      items.findIndex((item) => item === pos),
    );
    set(itemsAtom, remove(items, index));
  },
);

export const clearItemsAtom = atom(null, (_get, set) => {
  const item = atom<IItem>(nullItem);
  set(itemsAtom, [item]);
  set(currentItemAtom, item);
});

export const nextItem = (get: Getter, set: Setter) =>
  set(
    currentItemAtom,
    nextValue(get(itemsAtom), eq(get(currentItemAtom))) ??
      atom<IItem>(nullItem),
  );

export const nextItemAtom = atom(null, nextItem);
