import { atom } from "jotai";
import { atomEffect } from "jotai-effect";
import { focusAtom } from "jotai-optics";

import { Item, getNullLists, validateListsSchema } from "./model";
import { resetTimerAtom } from "../timers";
import { insert, remove, replace } from "../utils/arrays";
import { getStorageAtom } from "../utils/storage";
import { getUUID } from "../utils/uuid";

const listsAtom = getStorageAtom(getNullLists(), "lists", {
  debounceDelai: 1000,
  validate: validateListsSchema,
  normalize: (x) => {
    if (x.index > x.items.length - 1) x = { ...x, index: x.items.length - 1 };
    if (x.index < 0) x = { ...x, index: 0 };
    return x;
  },
  effects: [
    atomEffect((get, set) => {
      get(currentSecondsAtom);
      get(currentIdAtom);
      set(resetTimerAtom);
    }),
  ],
});

export const currentIndexAtom = focusAtom(listsAtom, (o) => o.prop("index"));

export const itemsAtom = focusAtom(listsAtom, (o) => o.prop("items"));

export const getIdItemSecondsAtom = (id: string) =>
  focusAtom(listsAtom, (o) =>
    o
      .prop("items")
      .find((item) => item.id === id)
      .prop("seconds"),
  );

const currentItemAtom = atom(
  (get) => {
    const { index, items } = get(listsAtom);
    return items[index];
  },
  (get, set, item: Item) => {
    const lists = get(listsAtom);
    const { index, items } = lists;
    set(listsAtom, { ...lists, items: replace(index, items, item) });
  },
);

const currentIdAtom = atom((get) => {
  return get(currentItemAtom).id;
});

export const currentSecondsAtom = focusAtom(currentItemAtom, (o) =>
  o.prop("seconds"),
);

export const duplicateIndexAtom = atom(null, (get, set, index: number) => {
  const lists = get(listsAtom);
  let { items, index: currentIndex } = lists;
  const item = { ...items[currentIndex], id: getUUID() };
  items = insert(items, index, item);
  if (index < currentIndex) currentIndex++;
  set(listsAtom, { ...lists, index: currentIndex, items });
});

export const removeIndexAtom = atom(null, (get, set, index: number) => {
  const lists = get(listsAtom);
  let { items, index: currentIndex } = lists;
  if (items.length === 1) {
    set(clearItemsAtom);
    return;
  }
  items = remove(items, index);
  if (index < currentIndex) index--;
  set(listsAtom, { ...lists, index: currentIndex, items });
});

export const clearItemsAtom = atom(null, (_get, set) => {
  set(listsAtom, getNullLists());
});
