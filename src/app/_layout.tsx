import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSetAtom } from "jotai";
import { ReactNode } from "react";
import { View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { KeepAliveWhenTimerActive } from "@/components/keepAlive";
import { useInter } from "@/fonts/inter";
import { useRobotoMono } from "@/fonts/roboto-mono";
import { useColor } from "@/hooks/color";
import { usePlay } from "@/hooks/sound";
import { useInitCountDown } from "@/stores/countDown/init";
import { useInitNow } from "@/stores/now/init";
import { useInitTimerList } from "@/stores/timerLists/init";
import { useInitTimerListStorage } from "@/stores/timerLists/storage";
import { resetTimerAtom } from "@/stores/timers";
import { sizes, spaces } from "@/styles";

function Container({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        height: "100%",
        alignItems: "center",
        paddingTop: insets.top + spaces[10],
        paddingRight: insets.right,
        paddingBottom: insets.bottom + spaces[10],
        paddingLeft: insets.left,
        backgroundColor: useColor("background"),
      }}
    >
      <View
        style={{
          maxWidth: sizes.screenMaxWidth,
          height: "100%",
          width: "100%",
        }}
      >
        {children}
      </View>
    </View>
  );
}

export default function Layout() {
  useInitNow();
  useInitCountDown(usePlay(require("@/../assets/beep.mp3")));
  useInitTimerList(useSetAtom(resetTimerAtom));
  const timerReady = useInitTimerListStorage("timerList");
  const interReady = useInter();
  const robotoMonoReady = useRobotoMono();
  if (!timerReady || !interReady || !robotoMonoReady) return null;
  return (
    <>
      <KeepAliveWhenTimerActive />
      <SafeAreaProvider>
        <Container>
          <Stack />
          <StatusBar style="auto" />
        </Container>
      </SafeAreaProvider>
    </>
  );
}
