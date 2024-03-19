import { Getter, Setter, atom } from "jotai";
import { focusAtom } from "jotai-optics";

import { insert, nextId, remove } from "./core";

interface IItem {
  id: string;
  seconds: number;
}

export const itemsAtom = atom<IItem[]>([
  { id: "0", seconds: 1 },
  { id: "1", seconds: 2 },
  { id: "2", seconds: 3 },
]);

export const currentItemIdAtom = atom("0");
const nextIdAtom = atom(3);

// atomFamily?
export const itemSecondsAtomById = (id: string) =>
  focusAtom(itemsAtom, (o) => o.find((item) => item.id === id).prop("seconds"));

export const currentItemSecondsAtom = atom((get) =>
  get(itemSecondsAtomById(get(currentItemIdAtom))),
);

export const insertItemAtom = atom(null, (get, set, id: string) => {
  const n = get(nextIdAtom);
  set(nextIdAtom, n + 1);

  const items = get(itemsAtom);
  let index = items.findIndex((item) => item.id === id);
  if (index < 0) index = 0;
  const item = {
    id: String(n),
    seconds: items[index]?.seconds ?? 0,
  };
  set(itemsAtom, insert(items, index, item));
});

export const removeItemAtom = atom(null, (get, set, id: string) => {
  const items = get(itemsAtom);
  if (items.length === 1) {
    set(clearItemsAtom);
    return;
  }
  let index = items.findIndex((item) => item.id === id);
  if (index < 0) index = 0;

  set(itemsAtom, remove(items, index));
});

export const clearItemsAtom = atom(null, (get, set) => {
  const item = get(itemsAtom)[0];
  set(itemsAtom, [{ ...item, seconds: 0 }]);
  set(currentItemIdAtom, item.id);
});

export const nextItem = (get: Getter, set: Setter) =>
  set(currentItemIdAtom, nextId(get(itemsAtom), get(currentItemIdAtom)));

export const nextItemAtom = atom(null, nextItem);
