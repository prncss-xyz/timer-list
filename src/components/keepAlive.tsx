import { useKeepAwake } from "expo-keep-awake";
import { useAtomValue } from "jotai";

import { timerActiveAtom } from "@/timers";

function KeepAlive() {
  useKeepAwake();
  return null;
}

export function KeepAliveWhenTimerActive() {
  const timerActive = useAtomValue(timerActiveAtom);
  return timerActive ?? <KeepAlive />;
}
