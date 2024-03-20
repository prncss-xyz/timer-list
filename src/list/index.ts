import { Getter, Setter, atom } from "jotai";
import { atomEffect } from "jotai-effect";

import { insert, remove } from "./core";
import { Item, nullItem } from "./model";
import { loadItems, saveItems } from "./storage";
import { getDebouncer } from "../utils/debouncer";
import { atomWithNativeStorage } from "../utils/storage";

const defaultTimerAtom = atom<Item>(nullItem);
export type ItemAtom = typeof defaultTimerAtom;

export const itemsAtom = atom([defaultTimerAtom]);
itemsAtom.onMount = (setAtom) => {
  loadItems().then((items) => setAtom(items.map((item) => atom(item))));
};
const debouncer = getDebouncer(1000, saveItems);
export const saveListEffect = atomEffect((get) => {
  debouncer(get(itemsAtom).map((item) => get(item)));
});

export const currentIndexAtom = atomWithNativeStorage(0, "index");

const currentItemAtom = atom(
  (get) => get(itemsAtom).at(get(currentIndexAtom)) ?? defaultTimerAtom,
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
  (get, set, index: number, item: ItemAtom) => {
    const items = get(itemsAtom);
    set(itemsAtom, insert(items, index, atom(get(item))));
    const currentIndex = get(currentIndexAtom);
    if (index < currentIndex) set(currentIndexAtom, currentIndex + 1);
  },
);

export const removeItemAtom = atom(null, (get, set, index: number) => {
  const items = get(itemsAtom);
  if (items.length === 1) {
    set(clearItemsAtom);
    return;
  }
  set(itemsAtom, remove(items, index));
  const currentIndex = get(currentIndexAtom);
  if (index < currentIndex) index--;
  index = Math.min(index, Math.max(0, items.length - 2));
  set(currentIndexAtom, index);
});

export const clearItemsAtom = atom(null, (_get, set) => {
  const item = atom<Item>(nullItem);
  set(itemsAtom, [item]);
  set(currentIndexAtom, 0);
});

export const nextItem = (get: Getter, set: Setter) =>
  set(
    currentIndexAtom,
    Math.min(get(currentIndexAtom) + 1, Math.max(0, get(itemsAtom).length - 1)),
  );

export const nextItemAtom = atom(null, nextItem);
