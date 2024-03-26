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
import { useInitCountDown } from "../src/countDown";
import { usePlay } from "../src/sound";
import { colors, sizes } from "../src/styles";

import { KeepAliveWhenTimerActive } from "@/components/keepAlive";

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

export default function HomeLayout() {
  useInitCountDown(usePlay(beep));
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
