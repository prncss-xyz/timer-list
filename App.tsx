import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import {
  FlatList,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputTextInputEventData,
  View,
} from "react-native";

// @ts-ignore
import duckSound from "./assets/duck.mp3";
import {
  clearItemsAtom,
  currentItemIdAtom,
  insertItemAtom,
  itemsAtom,
  removeItemAtom,
} from "./src/list";
import { loadSoundAtom } from "./src/sound";
import {
  isTimerActiveAtom,
  alarmEffect,
  resetTimerAtom,
  timerSecondsAtom,
  toggleTimerAtom,
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
  const seconds = useAtomValue(timerSecondsAtom);
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

function Item({ id }: { id: string }) {
  const [seconds, setSeconds] = useAtom(timerSecondsAtom);
  const [current, navigate] = useAtom(currentItemIdAtom);
  const reset = useSetAtom(resetTimerAtom);
  const active = current === id;
  const activate = useCallback(() => {
    navigate(id);
    reset();
  }, [navigate, reset, id]);
  const insertItem = useSetAtom(insertItemAtom);
  const insert = useCallback(() => insertItem(id), [insertItem, id]);
  const removeItem = useSetAtom(removeItemAtom);
  const remove = useCallback(() => removeItem(id), [removeItem, id]);
  const onTextInput = useCallback((value: string) => {
    const seconds_ = Number(value);
    if (isNaN(seconds_)) return;
    setSeconds(seconds_);
  }, []);
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
            "-"
          )}
        </View>
        <TextInput
          style={{ padding: 5, backgroundColor: active ? "green" : "blue" }}
          value={String(seconds)}
          onChangeText={onTextInput}
          keyboardType="decimal-pad"
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
      renderItem={({ item }) => <Item {...item} />}
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
