import { Getter, Setter, atom } from "jotai";
import { focusAtom } from "jotai-optics";

import { Item, nullLists, validateListsSchema } from "./model";
import { insert, remove, replace } from "../utils/arrays";
import { atomWithNativeStorage } from "../utils/storage";
import { getUUID } from "../utils/uuid";

const listsAtom = atomWithNativeStorage(nullLists, "lists", {
  debounceDelai: 1000,
  validate: validateListsSchema,
});

export const currentIndexAtom = focusAtom(listsAtom, (o) => o.prop("index"));

export const itemsAtom = focusAtom(listsAtom, (o) => o.prop("items"));

export const getIdItemAtom = (id: string) =>
  focusAtom(listsAtom, (o) => o.prop("items").find((item) => item.id === id));

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

export const currentItemSecondsAtom = focusAtom(currentItemAtom, (o) =>
  o.prop("seconds"),
);

export const duplicateItemAtom = atom(null, (get, set, id: string) => {
  const lists = get(listsAtom);
  let { items, index } = lists;
  const itemIndex = items.findIndex((item) => item.id === id);
  if (itemIndex < 0) return;
  const item = { ...items[index], id: getUUID() };
  items = insert(items, itemIndex, item);
  if (itemIndex < index) index = index + 1;
  set(listsAtom, { ...lists, index, items });
});

export const removeItemAtom = atom(null, (get, set, id: string) => {
  const lists = get(listsAtom);
  let { items, index } = lists;
  if (items.length === 1) {
    set(clearItemsAtom);
    return;
  }
  let itemIndex = items.findIndex((item) => item.id === id);
  if (itemIndex < 0) return;
  items = remove(items, itemIndex);
  if (itemIndex < index) itemIndex--;
  itemIndex = Math.min(itemIndex, Math.max(0, items.length - 2));
  set(listsAtom, { ...lists, index, items });
});

export const clearItemsAtom = atom(null, (_get, set) => {
  set(listsAtom, nullLists);
});

export const nextItem = (get: Getter, set: Setter) =>
  set(
    currentIndexAtom,
    Math.min(get(currentIndexAtom) + 1, Math.max(0, get(itemsAtom).length - 1)),
  );

export const nextItemAtom = atom(null, nextItem);
