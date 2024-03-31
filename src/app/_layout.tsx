import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSetAtom } from "jotai";
import { ReactNode } from "react";
import { View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { KeepAliveWhenTimerActive } from "@/components/keepAlive";
import { usePlay } from "@/hooks/sound";
import { useInitCountDown } from "@/stores/countDown/init";
import { useInitNow } from "@/stores/now/init";
import { useInitTimerList } from "@/stores/timerLists/init";
import { resetTimerAtom } from "@/stores/timers";
import { colors, sizes } from "@/styles";

function Container({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        height: "100%",
        alignItems: "center",
        paddingTop: insets.top + 10,
        paddingRight: insets.right,
        paddingBottom: insets.bottom + 10,
        paddingLeft: insets.left,
        backgroundColor: colors.background,
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
  const ready = useInitTimerList(useSetAtom(resetTimerAtom));
  if (!ready) return null;
  return (
    <>
      <KeepAliveWhenTimerActive />
      <SafeAreaProvider>
        <Container>
          <Slot />
          <StatusBar style="auto" />
        </Container>
      </SafeAreaProvider>
    </>
  );
}
