import { atom } from "jotai";
import { atomEffect } from "jotai-effect";

import { activeSecondsAtom, nextActiveItemAtom } from "../timerLists";
import {
  timerElapsedAtom,
  timerActiveAtom,
  stopTimerAtom,
  resetTimerAtom,
} from "../timers";

import { fromSeconds } from "@/utils/seconds";

const countDownMsAtom = atom((get) => {
  const elapsed = get(timerElapsedAtom);
  const seconds = get(activeSecondsAtom) ?? 0;
  const total = seconds * 1000;
  return Math.max(0, total - elapsed);
});

export const getAlarmEffect = (alarm: () => void) =>
  atomEffect((get, set) => {
    if (get(timerActiveAtom) === false || get(countDownMsAtom) > 0) return;
    set(stopTimerAtom);
    set(nextActiveItemAtom);
    set(resetTimerAtom);
    alarm();
  });

export const countDownTextAtom = atom((get) =>
  fromSeconds(Math.ceil(get(countDownMsAtom) / 1000)),
);
