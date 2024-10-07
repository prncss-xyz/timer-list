// we use the plural form in filename as it will eventually manage many lisits
import {
  findOne,
  prop,
  simpleStateMachine,
  flow,
  eq,
  put,
  view,
  valueOr,
} from "@constellar/core";
import { machineAtom, valueEventAtom } from "@constellar/jotai";
import { atomWithStorage } from "jotai/utils";
import { atomEffect } from "jotai-effect";

import { duplicate, next, remove, clear, TimerList } from "./core";

import { resolvedAtom } from "@/utils/atoms";

/* const rawTimerListAtom = atom(normalize({ index: "", items: [] })); */

const activeO = flow(eq<TimerList>(), prop("active"));
const secondsO = (id: string) =>
  flow(
    eq<TimerList>(),
    prop("items"),
    findOne((item) => item.id === id),
    prop("seconds"),
    valueOr(0),
  );

function init() {
  return {
    active: "_0",
    items: [
      { seconds: 1, id: "_0" },
      { seconds: 2, id: "_1" },
      { seconds: 3, id: "_2" },
    ],
  };
}

const timerListMachine = simpleStateMachine({
  init,
  events: {
    setActiveId: ({ target }: { target: string }, state) =>
      put(activeO, target)(state),
    setItemSeconds: (
      { target, seconds }: { target: string; seconds: number },
      state,
    ) => put(secondsO(target), seconds)(state),
    next,
    duplicate,
    remove,
    clear,
  },
});

// this is used for testing
export const timerListKey = "v0";

export const timerListAtom = machineAtom(timerListMachine(), {
  atomFactory: (init) => atomWithStorage(timerListKey, init),
});

export const activeIdAtom = valueEventAtom(
  timerListAtom,
  (state) => state.active,
  (target, send) => send({ type: "setActiveId", target }),
);

export const getItemSecondsAtom = (target: string) =>
  valueEventAtom(timerListAtom, view(secondsO(target)), (seconds, send) =>
    send({
      type: "setItemSeconds",
      target,
      seconds,
    }),
  );

export const activeSecondsAtom = resolvedAtom(activeIdAtom, getItemSecondsAtom);

export const getTimerUpdateEffect = (cb: () => void) =>
  atomEffect((get) => {
    get(activeSecondsAtom);
    get(activeIdAtom);
    cb();
  });
