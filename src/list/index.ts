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
  normalize: (lists) => {
    const { index, items } = lists;
    if (index > items.length - 1) lists = { ...lists, index: items.length - 1 };
    if (index < 0) lists = { ...lists, index: 0 };
    if (items.length === 0) lists = getNullLists();
    return lists;
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

export const currentIdAtom = atom(
  (get) => {
    return get(currentItemAtom).id;
  },
  (get, set, id: string) => {
    const lists = get(listsAtom);
    const { items } = lists;
    const index = items.findIndex((item) => item.id === id);
    set(listsAtom, { ...lists, index, items });
  },
);

export const currentSecondsAtom = focusAtom(currentItemAtom, (o) =>
  o.prop("seconds"),
);

export const duplicateIndexAtom = atom(null, (get, set, index: number) => {
  const lists = get(listsAtom);
  let { items, index: currentIndex } = lists;
  const item = { ...items[index], id: getUUID() };
  items = insert(items, index, item);
  if (index < currentIndex) currentIndex++;
  set(listsAtom, { ...lists, index: currentIndex, items });
});

export const removeIndexAtom = atom(null, (get, set, index: number) => {
  const lists = get(listsAtom);
  let { items, index: currentIndex } = lists;
  items = remove(items, index);
  if (index < currentIndex) index--;
  set(listsAtom, { ...lists, index: currentIndex, items });
});

export const clearItemsAtom = atom(null, (_get, set) => {
  set(itemsAtom, []);
});
