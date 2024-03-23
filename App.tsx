import { Inter_400Regular, useFonts } from "@expo-google-fonts/inter";
import { StatusBar } from "expo-status-bar";
import { ReactNode } from "react";
import { View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

// @ts-ignore
import duckSound from "./assets/duck.mp3";
import { Clear } from "./src/components/clear";
import { List } from "./src/components/list";
import { TimerBar } from "./src/components/timerBar";
import { useInitCountDown } from "./src/countDown";
import { useSound } from "./src/sound";
import { colors } from "./src/styles";

function WithFonts({ children }: { children: ReactNode }) {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
  });
  if (!fontsLoaded) {
    return null;
  }
  return <>{children}</>;
}

function SafeContainer({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: insets.top,
        paddingRight: insets.right,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        backgroundColor: colors.background,
      }}
    >
      {children}
    </View>
  );
}

export default function App() {
  useInitCountDown(useSound(duckSound));
  return (
    <WithFonts>
      <SafeAreaProvider>
        <SafeContainer>
          <View
            style={{
              flex: 1,
              width: "100%",
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
        </SafeContainer>
      </SafeAreaProvider>
    </WithFonts>
  );
}
