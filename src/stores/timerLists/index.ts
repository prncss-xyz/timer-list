// we use the plural form in filename as it will eventually manage many lisits
import { atom } from "jotai";
import { atomEffect } from "jotai-effect";
import { focusAtom } from "jotai-optics";

import { Item, normalize } from "./model";

import { definedAtom } from "@/utils/definedAtom";
import { fromSeconds, toSeconds } from "@/utils/seconds";
import { getUUID } from "@/utils/uuid";

/* const rawTimerListAtom = atom(normalize({ index: 0, items: [] })); */
const rawTimerListAtom = atom(
  normalize({
    index: 0,
    items: [
      { seconds: 1, id: getUUID() },
      { seconds: 2, id: getUUID() },
      { seconds: 3, id: getUUID() },
    ],
  }),
);
export const timerListAtom = focusAtom(rawTimerListAtom, (o) =>
  o.rewrite(normalize),
);

export const currentIndexAtom = focusAtom(timerListAtom, (o) =>
  o.prop("index"),
);

export const itemsAtom = focusAtom(timerListAtom, (o) => o.prop("items"));

const currentItemAtom = atom(
  (get) => {
    const { index, items } = get(timerListAtom);
    return items[index];
  },
  (get, set, item: Item) => {
    const lists = get(timerListAtom);
    let { index, items } = lists;
    items = items.toSpliced(index, 1, item);
    set(timerListAtom, { ...lists, items });
  },
);

export const currentIdAtom = atom(
  (get) => {
    return get(currentItemAtom).id;
  },
  (get, set, id: string) => {
    const lists = get(timerListAtom);
    const { items } = lists;
    const index = items.findIndex((item) => item.id === id);
    set(timerListAtom, { ...lists, index, items });
  },
);

export const currentSecondsAtom = focusAtom(currentItemAtom, (o) =>
  o.prop("seconds"),
);

export const getIdItemAtom = (id: string) =>
  definedAtom(
    focusAtom(timerListAtom, (o) =>
      o.prop("items").find((item) => item.id === id),
    ),
    { id: "", seconds: 0 },
  );

export const getIdItemSecondsAtom = (id: string) =>
  focusAtom(getIdItemAtom(id), (o) => o.prop("seconds"));

export const getIdItemSecondsTextAtom = (id: string) =>
  focusAtom(getIdItemSecondsAtom(id), (o) => o.iso(fromSeconds, toSeconds));

export const duplicateIdAtom = atom(null, (get, set, id: string) => {
  const lists = get(timerListAtom);
  let { items, index: currentIndex } = lists;
  const index = items.findIndex((item) => item.id === id);
  if (index < 0) return;
  const item = { ...items[index], id: getUUID() };
  items = items.toSpliced(index, 0, item);
  if (index <= currentIndex) currentIndex++;
  set(timerListAtom, { ...lists, index: currentIndex, items });
});

export const removeIdAtom = atom(null, (get, set, id: string) => {
  const lists = get(timerListAtom);
  let { items, index: currentIndex } = lists;
  const index = items.findIndex((item) => item.id === id);
  if (index < 0) return;
  items = items.toSpliced(index, 1);
  if (index < currentIndex) currentIndex--;
  set(timerListAtom, { ...lists, index: currentIndex, items });
});

export const clearItemsAtom = atom(null, (_get, set) => {
  set(itemsAtom, []);
});

export const getTimerUpdateEffect = (cb: () => void) =>
  atomEffect((get) => {
    get(currentSecondsAtom);
    get(currentIdAtom);
    cb();
  });
