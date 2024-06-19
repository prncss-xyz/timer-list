import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider, createStore, useSetAtom } from "jotai";
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

const store = createStore();

// fix multiple stores issues
function WithStore({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

function CompositionRoot({ children }: { children: ReactNode }) {
  useInitNow();
  useInitCountDown(usePlay(require("@/../assets/beep.mp3")));
  useInitTimerList(useSetAtom(resetTimerAtom));
  const interReady = useInter();
  const robotoMonoReady = useRobotoMono();
  if (!interReady || !robotoMonoReady) return null;
  return <>{children}</>;
}

export default function Layout() {
  return (
    <WithStore>
      <CompositionRoot>
        <KeepAliveWhenTimerActive />
        <SafeAreaProvider>
          <Container>
            <Slot />
            <StatusBar style="auto" />
          </Container>
        </SafeAreaProvider>
      </CompositionRoot>
    </WithStore>
  );
}
