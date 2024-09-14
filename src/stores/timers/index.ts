import { machineAtom, selectAtom } from "@constellar/jotai";
import { atom } from "jotai";

import { timerMachine } from "./machine";
import { nowAtom } from "../now";

export const timerAtom = machineAtom(timerMachine());

export const timerRunningAtom = selectAtom(
  timerAtom,
  (timer) => timer.type === "running",
);

export const resetTimerAtom = atom(null, (get, set) => {
  set(timerAtom, { type: "reset", now: get(nowAtom) });
});

export const toggleTimerAtom = atom(null, (get, set) => {
  set(timerAtom, { type: "toggle", now: get(nowAtom) });
});

export const timerCountAtom = atom((get) => get(timerAtom).count(get(nowAtom)));
