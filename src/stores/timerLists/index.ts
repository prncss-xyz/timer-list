import { atom, useAtomValue } from "jotai";
import { atomEffect } from "jotai-effect";
import { focusAtom } from "jotai-optics";
import { useMemo } from "react";

import { Item, getNullTimerList, validateListsSchema } from "./model";

import { fromSeconds, toSeconds } from "@/utils/seconds";
import { getStorageAtom } from "@/utils/storage";
import { getUUID } from "@/utils/uuid";

const timerListsAtom = getStorageAtom(getNullTimerList(), "lists", {
  debounceDelai: 1000,
  validate: validateListsSchema,
  normalize: (lists) => {
    const { index, items } = lists;
    if (index > items.length - 1) lists = { ...lists, index: items.length - 1 };
    if (index < 0) lists = { ...lists, index: 0 };
    if (items.length === 0) lists = getNullTimerList();
    return lists;
  },
});

export const currentIndexAtom = focusAtom(timerListsAtom, (o) =>
  o.prop("index"),
);

export const itemsAtom = focusAtom(timerListsAtom, (o) => o.prop("items"));

export const getIdItemSecondsAtom = (id: string) =>
  focusAtom(timerListsAtom, (o) =>
    o
      .prop("items")
      .find((item) => item.id === id)
      .prop("seconds"),
  );

export const getIdItemSecondsTextAtom = (id: string) =>
  focusAtom(timerListsAtom, (o) =>
    o
      .prop("items")
      .find((item) => item.id === id)
      .prop("seconds")
      .iso(fromSeconds, toSeconds),
  );

const currentItemAtom = atom(
  (get) => {
    const { index, items } = get(timerListsAtom);
    return items[index];
  },
  (get, set, item: Item) => {
    const lists = get(timerListsAtom);
    let { index, items } = lists;
    items = items.toSpliced(index, 1, item);
    set(timerListsAtom, { ...lists, items });
  },
);

export const currentIdAtom = atom(
  (get) => {
    return get(currentItemAtom).id;
  },
  (get, set, id: string) => {
    const lists = get(timerListsAtom);
    const { items } = lists;
    const index = items.findIndex((item) => item.id === id);
    set(timerListsAtom, { ...lists, index, items });
  },
);

export const currentSecondsAtom = focusAtom(currentItemAtom, (o) =>
  o.prop("seconds"),
);

export const duplicateIdAtom = atom(null, (get, set, id: string) => {
  const lists = get(timerListsAtom);
  let { items, index: currentIndex } = lists;
  const index = items.findIndex((item) => item.id === id);
  if (index < 0) return;
  const item = { ...items[index], id: getUUID() };
  items = items.toSpliced(index, 0, item);
  if (index <= currentIndex) currentIndex++;
  set(timerListsAtom, { ...lists, index: currentIndex, items });
});

export const removeIdAtom = atom(null, (get, set, id: string) => {
  const lists = get(timerListsAtom);
  let { items, index: currentIndex } = lists;
  const index = items.findIndex((item) => item.id === id);
  if (index < 0) return;
  items = items.toSpliced(index, 1);
  if (index < currentIndex) currentIndex--;
  set(timerListsAtom, { ...lists, index: currentIndex, items });
});

export const clearItemsAtom = atom(null, (_get, set) => {
  set(itemsAtom, []);
});

export function useInitTimerLists(cb: () => void) {
  const effect = useMemo(
    () =>
      atomEffect((get) => {
        get(currentSecondsAtom);
        get(currentIdAtom);
        cb();
      }),
    [cb],
  );
  useAtomValue(effect);
}
