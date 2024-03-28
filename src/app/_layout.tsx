import { Inter_400Regular, useFonts } from "@expo-google-fonts/inter";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSetAtom } from "jotai";
import { ReactNode } from "react";
import { SafeAreaView, View } from "react-native";
import {
  SafeAreaProvider,
  /* useSafeAreaInsets, */
} from "react-native-safe-area-context";

// @ts-ignore
import beep from "@/../assets/beep.mp3";
import { KeepAliveWhenTimerActive } from "@/components/keepAlive";
import { usePlay } from "@/hooks/sound";
import { useInitCountDown } from "@/stores/countDown/init";
import { useInitNow } from "@/stores/now/init";
import { useInitTimerLists } from "@/stores/timerLists/init";
import { resetTimerAtom } from "@/stores/timers";
import { colors, sizes } from "@/styles";

function WithFonts({ children }: { children: ReactNode }) {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
  });
  if (!fontsLoaded) {
    return null;
  }
  return <>{children}</>;
}

function Container({ children }: { children: ReactNode }) {
  /* const insets = useSafeAreaInsets(); */
  return (
    <SafeAreaView
      style={{
        height: "100%",
        alignItems: "center",
        /* paddingTop: insets.top, */
        /* paddingRight: insets.right, */
        /* paddingBottom: insets.bottom, */
        /* paddingLeft: insets.left, */
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
    </SafeAreaView>
  );
}

export default function Layout() {
  useInitNow();
  useInitCountDown(usePlay(beep));
  const ready = useInitTimerLists(useSetAtom(resetTimerAtom));
  if (!ready) return null;
  return (
    <WithFonts>
      <KeepAliveWhenTimerActive />
      <SafeAreaProvider>
        <Container>
          <Slot />
          <StatusBar style="auto" />
        </Container>
      </SafeAreaProvider>
    </WithFonts>
  );
}
