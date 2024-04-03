import { useAtomValue } from "jotai";
import { useMemo } from "react";

import { getTimerUpdateEffect } from ".";

export function useInitTimerList(cb: () => void) {
  const effect = useMemo(() => getTimerUpdateEffect(cb), [cb]);
  useAtomValue(effect);
}
