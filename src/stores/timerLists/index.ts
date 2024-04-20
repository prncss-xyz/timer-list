// we use the plural form in filename as it will eventually manage many lisits
import { atom } from "jotai";
import { atomEffect } from "jotai-effect";
import { focusAtom } from "jotai-optics";

import { duplicateId, nextActiveItem, removeId } from "./core";
import { normalize } from "./model";

import { resolvedAtom } from "@/utils/atoms";
import { secondsString } from "@/utils/seconds";
import { getUUID } from "@/utils/uuid";

/* const rawTimerListAtom = atom(normalize({ index: "", items: [] })); */
const uuid = getUUID();
const rawTimerListAtom = atom(
  normalize({
    active: uuid,
    items: [
      { seconds: 1, id: uuid },
      { seconds: 2, id: getUUID() },
      { seconds: 3, id: getUUID() },
    ],
  }),
);
export const timerListAtom = focusAtom(rawTimerListAtom, (o) =>
  o.rewrite(normalize),
);

export const activeIdAtom = focusAtom(timerListAtom, (o) => o.prop("active"));

export const nextActiveItemAtom = atom(null, (_get, set) => {
  set(timerListAtom, nextActiveItem);
});

export const itemsAtom = focusAtom(timerListAtom, (o) => o.prop("items"));

export const getIdItemSecondsTextAtom = (id: string) =>
  focusAtom(timerListAtom, (o) =>
    o
      .prop("items")
      .find((item) => item.id === id)
      .prop("seconds")
      .compose(secondsString),
  );

export const getDuplicateIdAtom = (id: string) =>
  atom(null, (_get, set) => set(timerListAtom, duplicateId(id)));

export const getRemoveIdAtom = (id: string) =>
  atom(null, (_get, set) => {
    set(timerListAtom, removeId(id));
  });

export const clearItemsAtom = atom(null, (_get, set) => {
  set(itemsAtom, []);
});

export const activeSecondsAtom = resolvedAtom(activeIdAtom, (id: string) =>
  focusAtom(itemsAtom, (o) => o.find((item) => item.id === id).prop("seconds")),
);

export const getTimerUpdateEffect = (cb: () => void) =>
  atomEffect((get) => {
    get(activeSecondsAtom);
    get(activeIdAtom);
    cb();
  });
