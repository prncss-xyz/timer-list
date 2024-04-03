import { useAtomValue } from "jotai";
import { useMemo } from "react";

import { getAlarmEffect } from ".";

export function useInitCountDown(alarm: () => void) {
  const effect = useMemo(() => getAlarmEffect(alarm), [alarm]);
  useAtomValue(effect);
}
