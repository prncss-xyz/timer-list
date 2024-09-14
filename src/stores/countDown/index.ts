import { atom } from "jotai";
import { atomEffect } from "jotai-effect";

import { nowAtom } from "../now";
import { activeSecondsAtom, nextActiveItemAtom } from "../timerLists";
import { timerAtom, timerCountAtom } from "../timers";

import { fromSeconds } from "@/utils/seconds";

const countDownAtom = atom((get) => {
  const total = get(activeSecondsAtom);
  if (total === undefined) return 0;
  const count = get(timerCountAtom);
  return Math.max(0, Math.ceil(total - count / 1000));
});

export const countDownTextAtom = atom((get) => fromSeconds(get(countDownAtom)));

export const getAlarmEffect = (alarm: () => void) =>
  atomEffect((get, set) => {
    if (get(countDownAtom) > 0) return;
    const now = get(nowAtom);
    set(timerAtom, { type: "stop", now });
    set(nextActiveItemAtom);
    set(timerAtom, { type: "reset", now });
    alarm();
  });
