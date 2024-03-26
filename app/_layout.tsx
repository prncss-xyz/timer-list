import { Inter_400Regular, useFonts } from "@expo-google-fonts/inter";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { ReactNode } from "react";
import { View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

// @ts-ignore
import beep from "../assets/beep.mp3";

import { KeepAliveWhenTimerActive } from "@/components/keepAlive";
import { usePlay } from "@/hooks/sound";
import { useInitCountDown } from "@/stores/countDown";
import { colors, sizes } from "@/styles";
import { useInitTimerLists } from "@/stores/timerLists";
import { useSetAtom } from "jotai";
import { resetTimerAtom } from "@/stores/timers";

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
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        height: "100%",
        alignItems: "center",
        paddingTop: insets.top,
        paddingRight: insets.right,
        paddingBottom: insets.bottom,
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
  useInitCountDown(usePlay(beep));
  useInitTimerLists(useSetAtom(resetTimerAtom));
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
