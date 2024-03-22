import { Inter_400Regular, useFonts } from "@expo-google-fonts/inter";
import { StatusBar } from "expo-status-bar";
import { useAtom, useSetAtom } from "jotai";
import { ReactNode } from "react";
import { View } from "react-native";

// @ts-ignore
import duckSound from "./assets/duck.mp3";
import { Clear } from "./src/components/clear";
import { List } from "./src/components/list";
import { TimerBar } from "./src/components/timerBar";
import { loadSoundAtom } from "./src/sound";
import { colors, styles } from "./src/styles";
import { alarmEffect } from "./src/timers";

function WithFonts({ children }: { children: ReactNode }) {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
  });
  if (!fontsLoaded) {
    return null;
  }
  return <>{children}</>;
}

export default function App() {
  useSetAtom(loadSoundAtom)(duckSound);
  useAtom(alarmEffect);
  return (
    <WithFonts>
      <View style={styles.app}>
        <View
          style={{
            flex: 1,
            width: "100%",
            backgroundColor: colors.background,
            alignItems: "stretch",
            justifyContent: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <TimerBar />
            <View
              style={{
                marginTop: 15,
                marginBottom: 5,
                borderColor: colors.brand,
                borderBottomWidth: 1,
                borderStyle: "solid",
              }}
            />
            <List />
          </View>
          <Clear />
          <StatusBar style="auto" />
        </View>
      </View>
    </WithFonts>
  );
}
