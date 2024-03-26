import { useKeepAwake } from "expo-keep-awake";
import { useAtomValue } from "jotai";

import { timerActiveAtom } from "@/timers";

function KeepAlive() {
  useKeepAwake();
  return null;
}

export function KeepAliveWhenTimerActive() {
  if (__DEV__) {
    console.log("keep alive is disabled on development build");
    return;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const timerActive = useAtomValue(timerActiveAtom);
  return timerActive ?? <KeepAlive />;
}
