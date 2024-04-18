import { useKeepAwake } from "expo-keep-awake";
import { useAtomValue } from "jotai";
import { View } from "react-native";

import { timerActiveAtom } from "@/stores/timers";

function KeepAlive() {
  useKeepAwake();
  return <View />;
}

export function KeepAliveWhenTimerActive() {
  if (__DEV__) {
    console.log("keep alive is disabled on development build");
  }
  const timerActive = useAtomValue(timerActiveAtom);
  return timerActive ?? <KeepAlive />;
}
