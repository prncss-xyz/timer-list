import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { memo, useCallback, useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

// @ts-ignore
import duckSound from "./assets/duck.mp3";
import { TimeInput } from "./src/components/timeInput";
import { TimeView } from "./src/components/timeView";
import { useActivateAtom } from "./src/hooks/activate";
import {
  clearItemsAtom,
  currentIndexAtom,
  duplicateItemAtom,
  getIdItemSecondsAtom,
  itemsAtom,
  removeItemAtom,
} from "./src/list";
import { loadSoundAtom } from "./src/sound";
import {
  isTimerActiveAtom,
  alarmEffect,
  resetTimerAtom,
  toggleTimerAtom,
  roundedTimerSecondsAtom,
} from "./src/timers";

function Reset() {
  const reset = useSetAtom(resetTimerAtom);
  return (
    <Pressable onPress={reset}>
      <Text>reset</Text>
    </Pressable>
  );
}

function Clear() {
  const clear = useSetAtom(clearItemsAtom);
  return (
    <Pressable onPress={clear}>
      <Text>clear</Text>
    </Pressable>
  );
}

function Count() {
  const toggle = useSetAtom(toggleTimerAtom);
  const active = useAtomValue(isTimerActiveAtom);
  const seconds = useAtomValue(roundedTimerSecondsAtom);
  return (
    <Pressable onPress={toggle}>
      <View
        style={{
          backgroundColor: active ? "yellow" : "lightblue",
        }}
      >
        <TimeView value={seconds} />
      </View>
    </Pressable>
  );
}

const Item = memo(({ index, id }: { index: number; id: string }) => {
  const [seconds, setSeconds] = useAtom(
    useMemo(() => getIdItemSecondsAtom(id), [id]),
  );
  const reset = useSetAtom(resetTimerAtom);
  const [active, activate] = useActivateAtom(index, currentIndexAtom);
  const activate_ = useCallback(() => {
    activate();
    reset();
  }, [activate, reset]);
  const duplicateItem = useSetAtom(duplicateItemAtom);
  const insert = useCallback(() => duplicateItem(id), [duplicateItem, id]);
  const removeItem = useSetAtom(removeItemAtom);
  const remove = useCallback(() => removeItem(id), [removeItem, id]);
  return (
    <Pressable onPress={activate_}>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          height: 30,
        }}
      >
        <View style={{ width: 30 }}>
          {active ? (
            <Ionicons name="caret-forward-outline" size={20} color="green" />
          ) : (
            <Text>-</Text>
          )}
        </View>
        <TimeInput active={active} value={seconds ?? 0} setValue={setSeconds} />
        <Pressable onPress={insert}>
          <Ionicons name="add-circle-outline" size={20} />
        </Pressable>
        <Pressable onPress={remove}>
          <Ionicons name="close-circle-outline" size={20} />
        </Pressable>
      </View>
    </Pressable>
  );
});

function List() {
  const items = useAtomValue(itemsAtom);
  return (
    <FlatList
      data={items}
      renderItem={({ index, item: { id } }) => <Item index={index} id={id} />}
      keyExtractor={({ id }) => id}
    />
  );
}

export default function App() {
  useSetAtom(loadSoundAtom)(duckSound);
  useAtom(alarmEffect);
  return (
    <View style={styles.container}>
      <Count />
      <Reset />
      <Clear />
      <List />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
