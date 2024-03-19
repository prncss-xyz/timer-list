import { atom } from "jotai";
import { atomEffect } from "jotai-effect";
import { focusAtom } from "jotai-optics";

import { Timer, getDelai, setDelai, stop, timerToggle } from "./core";
import { currentItemSecondsAtom, nextItem } from "../list";
import { nowAtom } from "../now";
import { playSoundAtom } from "../sound";

const timerAtom = atom<Timer>({
  type: "timer_stopped",
  delai: 0,
});

export const timerDelaiAtom = atom(
  (get) => getDelai(get(timerAtom), get(nowAtom)),
  (get, set, value: number) => {
    console.log(setDelai(get(timerAtom), value, get(nowAtom)));
    return set(timerAtom, setDelai(get(timerAtom), value, get(nowAtom)));
  },
);

export const timerSecondsAtom = focusAtom(timerDelaiAtom, (o) =>
  o.iso(
    (x) => x / 1000,
    (x) => x * 1000,
  ),
);

export const roundedTimerSecondsAtom = atom((get) =>
  Math.ceil(Math.max(0, get(timerSecondsAtom))),
);

export const resetTimerAtom = atom(null, (get, set) =>
  set(timerSecondsAtom, get(currentItemSecondsAtom) ?? 0),
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

  set(resetTimerAtom);
});
