import Ionicons from "@expo/vector-icons/Ionicons";
import { Inter_400Regular, useFonts } from "@expo-google-fonts/inter";
import { StatusBar } from "expo-status-bar";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ReactNode, memo, useCallback } from "react";
import { Text, FlatList, Pressable, SafeAreaView, View } from "react-native";

// @ts-ignore
import duckSound from "./assets/duck.mp3";
import { BaseText } from "./components/baseText";
import { TimeInput } from "./src/components/timeInput";
import { useActivateAtom } from "./src/hooks/activate";
import {
  clearItemsAtom,
  currentIndexAtom,
  duplicateItemAtom,
  itemsAtom,
  removeItemAtom,
} from "./src/list";
import { loadSoundAtom } from "./src/sound";
import { colors, sizes, styles } from "./src/styles";
import {
  alarmEffect,
  isTimerActiveAtom,
  resetTimerAtom,
  roundedTimerSecondsAtom,
  toggleTimerAtom,
} from "./src/timers";
import { fromSeconds } from "./src/utils/numbers";

function Reset({ color }: { color: string }) {
  const reset = useSetAtom(resetTimerAtom);
  return (
    <Pressable onPress={reset}>
      <Ionicons color={color} name="play-skip-back-outline" size={20} />
    </Pressable>
  );
}

function Clear() {
  const clear = useSetAtom(clearItemsAtom);
  return (
    <Pressable onPress={clear}>
      <Text style={styles.dangerButton}>clear all</Text>
    </Pressable>
  );
}

function PausePlay({ color }: { color: string }) {
  const toggle = useSetAtom(toggleTimerAtom);
  const active = useAtomValue(isTimerActiveAtom);
  return (
    <Pressable onPress={toggle}>
      <Ionicons
        color={color}
        name={active ? "pause" : "play"}
        size={sizes.icon}
      />
    </Pressable>
  );
}

function Count({ color }: { color: string }) {
  const toggle = useSetAtom(toggleTimerAtom);
  const seconds = useAtomValue(roundedTimerSecondsAtom);
  return (
    <Pressable onPress={toggle}>
      <View
        style={{
          backgroundColor: color,
          borderColor: color,
          borderWidth: 1,
          borderStyle: "solid",
          padding: 5,
        }}
      >
        <BaseText>{fromSeconds(seconds)}</BaseText>
      </View>
    </Pressable>
  );
}

function Remove({ id, color }: { id: string; color: string }) {
  const removeItem = useSetAtom(removeItemAtom);
  const remove = useCallback(() => removeItem(id), [removeItem, id]);
  return (
    <Pressable onPress={remove}>
      <Ionicons color={color} name="close-circle-outline" size={sizes.icon} />
    </Pressable>
  );
}

function Duplicate({ id, color }: { id: string; color: string }) {
  const duplicateItem = useSetAtom(duplicateItemAtom);
  const duplicate = useCallback(() => duplicateItem(id), [duplicateItem, id]);
  return (
    <Pressable onPress={duplicate}>
      <Ionicons color={color} name="add-circle-outline" size={sizes.icon} />
    </Pressable>
  );
}

function Activate({ index, color }: { index: number; color: string }) {
  const reset = useSetAtom(resetTimerAtom);
  const [active, activate] = useActivateAtom(index, currentIndexAtom);
  const activate_ = useCallback(() => {
    activate();
    reset();
  }, [activate, reset]);
  return (
    <Pressable onPress={activate_}>
      <Ionicons
        name={active ? "radio-button-on" : "radio-button-off"}
        size={sizes.icon}
        color={color}
      />
    </Pressable>
  );
}

const Item = memo(({ index, id }: { index: number; id: string }) => {
  const [active] = useActivateAtom(index, currentIndexAtom);
  const playing = useAtomValue(isTimerActiveAtom);
  const color = active
    ? playing
      ? colors.playing
      : colors.selected
    : colors.brand;
  const gap = 5;
  const width = sizes.icon * 2 + gap;
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 5,
      }}
    >
      <View style={{ flexDirection: "row", gap, width }}>
        <Activate color={color} index={index} />
      </View>
      <View
        style={{
          flex: 1,
          borderColor: color,
          borderWidth: 1,
          borderStyle: "solid",
        }}
      >
        <TimeInput id={id} color={color === colors.brand ? undefined : color} />
      </View>
      <View style={{ flexDirection: "row", gap, width }}>
        <Remove id={id} color={color} />
        <Duplicate id={id} color={color} />
      </View>
    </View>
  );
});

function List() {
  const items = useAtomValue(itemsAtom);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ gap: 5 }}
        data={items}
        renderItem={({ index, item: { id } }) => <Item index={index} id={id} />}
        keyExtractor={({ id }) => id}
      />
    </SafeAreaView>
  );
}

function TimerBar() {
  const active = useAtomValue(isTimerActiveAtom);
  const color = active ? colors.playing : colors.selected;
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
      }}
    >
      <PausePlay color={color} />
      <Count color={color} />
      <Reset color={color} />
    </View>
  );
}

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
      <View style={styles.base}>
        <View
          style={{
            flex: 1,
            /* height: "100%", */
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
                width: "100%",
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
