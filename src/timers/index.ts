import { atom } from "jotai";
import { atomEffect } from "jotai-effect";

import { Timer, getDelai, setDelai, stop, timerToggle } from "./core";
import { currentItemDurationAtom, nextItem } from "../list";
import { nowAtom } from "../now";
import { playSoundAtom } from "../sound";

const delai0 = 1000;
// Is it OK?
atomEffect((_get, set) => set(resetTimerAtom));

const timerAtom = atom<Timer>({
  type: "timer_stopped",
  delai: delai0,
});

export const resetTimerAtom = atom(null, (get, set) =>
  set(
    timerAtom,
    setDelai(get(timerAtom), get(currentItemDurationAtom), get(nowAtom)),
  ),
);

const timerDelaiAtom = atom(
  (get) => getDelai(get(timerAtom), get(nowAtom)),
  (get, set, value: number) =>
    set(timerAtom, setDelai(get(timerAtom), value, get(nowAtom))),
);

export const timerSecondsAtom = atom(
  (get) => Math.ceil(Math.max(0, get(timerDelaiAtom)) / 1000),
  (_get, set, seconds: number) =>
    set(timerDelaiAtom, Math.max(0, seconds) * 1000),
);

export const toggleTimerAtom = atom(null, (get, set) =>
  set(timerAtom, timerToggle(get(timerAtom), get(nowAtom))),
);

export const isTimerActiveAtom = atom(
  (get) => get(timerAtom).type === "timer_active",
);

export const alarmEffect = atomEffect((get, set) => {
  const timer = get(timerAtom);
  if (timer.type === "timer_stopped") return;
  const now = get(nowAtom);
  if (getDelai(timer, now) > 0) return;
  set(timerAtom, stop(timer, now));
  set(playSoundAtom);

  // HACK: why `nextItem` cannot be an atom?
  // I know it can be an attom if I call `get(currentIndexAtom)` here, so it's related to dependencies
  // still prefer this form to have the correct dependencies infered
  nextItem(get, set);

  // FIXME: why do we need to add this dependency?
  /* get(currentIndexAtom); */
  /* set(nextItemAtom); */

  set(resetTimerAtom);
});
