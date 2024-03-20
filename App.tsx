import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// @ts-ignore
import duckSound from "./assets/duck.mp3";
import {
  ItemAtom,
  clearItemsAtom,
  getIsCurrentIndexAtom,
  getSecondsAtom,
  insertItemAtom,
  itemsAtom,
  removeItemAtom,
  saveListEffect,
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
        <Text
          style={{
            padding: 5,
          }}
        >
          {seconds}
        </Text>
      </View>
    </Pressable>
  );
}

function Item({ index, itemAtom }: { index: number; itemAtom: ItemAtom }) {
  const [seconds, setSeconds] = useAtom(
    useMemo(() => getSecondsAtom(itemAtom), [itemAtom]),
  );
  const reset = useSetAtom(resetTimerAtom);
  const [active, navigate] = useAtom(
    useMemo(() => getIsCurrentIndexAtom(index), [index]),
  );
  const activate = useCallback(() => {
    navigate();
    reset();
  }, [navigate, reset, itemAtom]);
  const insertItem = useSetAtom(insertItemAtom);
  const insert = useCallback(
    () => insertItem(index, itemAtom),
    [insertItem, index, itemAtom],
  );
  const removeItem = useSetAtom(removeItemAtom);
  const remove = useCallback(() => removeItem(index), [removeItem, index]);
  const onTextInput = useCallback(
    (value: string) => {
      const seconds_ = Number(value);
      if (isNaN(seconds_)) return;
      setSeconds(seconds_);
    },
    [setSeconds],
  );
  return (
    <Pressable onPress={activate}>
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
        <TextInput
          style={{ padding: 5, backgroundColor: active ? "green" : "blue" }}
          value={String(seconds ?? 0)}
          onChangeText={onTextInput}
          inputMode="decimal"
        />
        <Pressable onPress={insert}>
          <Ionicons name="add-circle-outline" size={20} />
        </Pressable>
        <Pressable onPress={remove}>
          <Ionicons name="close-circle-outline" size={20} />
        </Pressable>
      </View>
    </Pressable>
  );
}

function List() {
  const items = useAtomValue(itemsAtom);
  return (
    <FlatList
      data={items}
      renderItem={({ item, index }) => <Item index={index} itemAtom={item} />}
      keyExtractor={String}
    />
  );
}

export default function App() {
  useSetAtom(loadSoundAtom)(duckSound);
  useAtom(alarmEffect);
  useAtom(saveListEffect);
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
