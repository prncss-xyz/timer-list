import { useAtomValue } from "jotai";
import { useMemo } from "react";

import { getTimerUpdateEffect, timerListAtom } from ".";
import { validateTimerListSchema } from "./model";

import { useStorageAtom } from "@/hooks/storage";

export function useInitTimerLists(cb: () => void) {
  const effect = useMemo(() => getTimerUpdateEffect(cb), [cb]);
  useAtomValue(effect);
  return useStorageAtom("timerLists_", timerListAtom, validateTimerListSchema);
}
