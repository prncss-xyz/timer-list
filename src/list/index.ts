import { Getter, Setter, atom } from "jotai";
import { atomEffect } from "jotai-effect";

import { insert, remove } from "./core";
import { Item, nullItem } from "./model";
import { loadItems, saveItems } from "./storage";

const defaultTimerAtom = atom<Item>(nullItem);
export type ItemAtom = typeof defaultTimerAtom;

export const itemsAtom = atom([defaultTimerAtom]);
itemsAtom.onMount = (setAtom) => {
  loadItems().then((items) => setAtom(items.map((item) => atom(item))));
};

export const saveListEffect = atomEffect((get) => {
  // TODO: debounce
  saveItems(get(itemsAtom).map((item) => get(item)));
});

const currentIndexAtom = atom(0);
const currentItemAtom = atom(
  (get) => get(itemsAtom).at(get(currentIndexAtom)) ?? defaultTimerAtom,
);

export const getIsCurrentIndexAtom = (index: number) =>
  atom(
    (get) => get(currentIndexAtom) === index,
    (_get, set) => set(currentIndexAtom, index),
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
  if (index > currentIndex) set(currentIndexAtom, currentIndex - 1);
});

export const clearItemsAtom = atom(null, (_get, set) => {
  const item = atom<Item>(nullItem);
  set(itemsAtom, [item]);
  set(currentIndexAtom, 0);
});

export const nextItem = (get: Getter, set: Setter) =>
  set(
    currentIndexAtom,
    Math.max(0, Math.min(get(currentIndexAtom) + 1, get(itemsAtom).length - 1)),
  );

export const nextItemAtom = atom(null, nextItem);
