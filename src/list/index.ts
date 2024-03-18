import { Getter, Setter, atom } from "jotai";

import { insert, remove } from "./core";

interface IItem {
  id: string;
  seconds: number;
}

export const itemsAtom = atom<IItem[]>([
  { id: "0", seconds: 1 },
  { id: "1", seconds: 2 },
  { id: "2", seconds: 3 },
]);

export const currentIndexAtom = atom(0);
const nextIdAtom = atom(3);

export const currentItemAtom = atom(
  (get) => get(itemsAtom)[get(currentIndexAtom)],
);

export const currentItemIdAtom = atom(
  (get) => get(currentItemAtom).id,
  (get, set, id: string) =>
    set(
      currentIndexAtom,
      get(itemsAtom).findIndex((item) => item.id === id),
    ),
);

export const currentItemDurationAtom = atom(
  (get) => get(currentItemAtom).seconds * 1000,
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
  const res = insert(items, index, item);
  const currentIndex = get(currentIndexAtom);
  if (index < currentIndex) set(currentIndexAtom, currentIndex + 1);

  set(itemsAtom, res);
});

export const removeItemAtom = atom(null, (get, set, id: string) => {
  const items = get(itemsAtom);
  if (items.length === 1) {
    set(clearItemsAtom);
    return;
  }
  let index = items.findIndex((item) => item.id === id);
  if (index < 0) index = 0;

  const res = remove(items, index);
  const currentIndex = get(currentIndexAtom);
  if (index < currentIndex || currentIndex === items.length - 1)
    set(currentIndexAtom, currentIndex - 1);
  set(itemsAtom, res);
});

export const clearItemsAtom = atom(null, (get, set) => {
  const items = get(itemsAtom);
  const item = items[0];
  set(itemsAtom, [{ ...item, seconds: 0 }]);
  set(currentIndexAtom, 0);
});

export const nextItem = (get: Getter, set: Setter) => {
  const index = get(currentIndexAtom);
  const len = get(itemsAtom).length;
  set(currentIndexAtom, Math.min(len - 1, index + 1));
};
export const nextItemAtom = atom(null, nextItem);
