import { atom } from "jotai";

import { Timer, getElapsed, stop, setElapsed, timerToggle } from "./core";

import { nowAtom } from "@/stores/now";

const timerAtom = atom<Timer>({
  type: "timer_stopped",
  elapsed: 0,
});

export const timerElapsedAtom = atom(
  (get) => getElapsed(get(timerAtom), get(nowAtom)),
  (get, set, elapsed: number) => {
    set(timerAtom, setElapsed(get(timerAtom), elapsed, get(nowAtom)));
  },
);

export const resetTimerAtom = atom(null, (_get, set) =>
  set(timerElapsedAtom, 0),
);

export const toggleTimerAtom = atom(null, (get, set) =>
  set(timerAtom, timerToggle(get(timerAtom), get(nowAtom))),
);

export const timerActiveAtom = atom(
  (get) => get(timerAtom).type === "timer_active",
);

export const stopTimerAtom = atom(null, (get, set) => {
  const timer = get(timerAtom);
  if (timer.type === "timer_active") set(timerAtom, stop(timer, get(nowAtom)));
});
