import { atom } from "jotai";
import { atomEffect } from "jotai-effect";

import { currentSecondsAtom, currentIndexAtom } from "../timerLists";
import {
  timerElapsedAtom,
  timerActiveAtom,
  stopTimerAtom,
  resetTimerAtom,
} from "../timers";

import { fromSeconds } from "@/utils/seconds";

const countDownMsAtom = atom((get) => {
  const elapsed = get(timerElapsedAtom);
  const total = get(currentSecondsAtom) * 1000;
  return Math.max(0, total - elapsed);
});

export const countDownSecondsAtom = atom((get) =>
  Math.ceil(get(countDownMsAtom) / 1000),
);

export const getAlarmEffect = (alarm: () => void) =>
  atomEffect((get, set) => {
    if (get(timerActiveAtom) === false || get(countDownMsAtom) > 0) return;
    set(stopTimerAtom);
    set(currentIndexAtom, (index) => index + 1);
    set(resetTimerAtom);
    alarm();
  });

export const countDownTextAtom = atom((get) =>
  fromSeconds(get(countDownSecondsAtom)),
);
