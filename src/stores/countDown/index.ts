import { atom } from "jotai";
import { atomEffect } from "jotai-effect";

import { activeSecondsAtom, nextActiveItemAtom } from "../timerLists";
import { timerElapsedAtom, stopTimerAtom, resetTimerAtom } from "../timers";

import { fromSeconds } from "@/utils/seconds";

function getCountDown(elapsedMs: number, total: number | undefined) {
  if (total === undefined) return 0;
  return Math.max(0, Math.ceil(total - elapsedMs / 1000));
}

const countDownAtom = atom((get) => {
  return getCountDown(get(timerElapsedAtom), get(activeSecondsAtom));
});

export const countDownTextAtom = atom((get) => fromSeconds(get(countDownAtom)));

export const getAlarmEffect = (alarm: () => void) =>
  atomEffect((get, set) => {
    if (get(countDownAtom) > 0) return;
    set(stopTimerAtom);
    set(nextActiveItemAtom);
    set(resetTimerAtom);
    alarm();
  });
