import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useSetAtom, useAtomValue } from "jotai";
import React, { useCallback, memo, useMemo } from "react";
import { Pressable, View, FlatList } from "react-native";

import { TimerView } from "../components/timerView";
import { useActivateAtom } from "../hooks/activate";
import {
  removeIndexAtom,
  duplicateIndexAtom,
  currentIndexAtom,
  itemsAtom,
  getIdItemSecondsAtom,
  currentIdAtom,
} from "../list";
import { sizes, colors } from "../styles";
import { timerActiveAtom } from "../timers";
import { fromSeconds } from "../utils/seconds";

function Remove({ index, color }: { index: number; color: string }) {
  const removeItem = useSetAtom(removeIndexAtom);
  const remove = useCallback(() => removeItem(index), [removeItem, index]);
  return (
    <Pressable onPress={remove}>
      <Ionicons color={color} name="close-circle-outline" size={sizes.icon} />
    </Pressable>
  );
}

function Duplicate({ index, color }: { index: number; color: string }) {
  const duplicateItem = useSetAtom(duplicateIndexAtom);
  const duplicate = useCallback(
    () => duplicateItem(index),
    [duplicateItem, index],
  );
  return (
    <Pressable onPress={duplicate}>
      <Ionicons color={color} name="add-circle-outline" size={sizes.icon} />
    </Pressable>
  );
}

function Activate({ index, color }: { index: number; color: string }) {
  const [active, activate] = useActivateAtom(index, currentIndexAtom);
  return (
    <Pressable onPress={active ? undefined : activate}>
      <Ionicons
        name={active ? "radio-button-on" : "radio-button-off"}
        size={sizes.icon}
        color={color}
      />
    </Pressable>
  );
}

// FIXME:
export function ListTimerView({ id, color }: { id: string; color: string }) {
  const seconds = useAtomValue(useMemo(() => getIdItemSecondsAtom(id), [id]));
  const setCurrentId = useSetAtom(currentIdAtom);
  const onPress = useCallback(() => {
    router.push(`/set-timer/${id}`);
    setCurrentId(id);
  }, [setCurrentId, id]);
  const text = fromSeconds(seconds ?? 0);
  return (
    <Pressable onPress={onPress}>
      <TimerView color={color} text={text} />
    </Pressable>
  );
}

const itemGap = 5;
const itemWidth = sizes.icon * 2 + itemGap;

const Item = memo(({ index, id }: { index: number; id: string }) => {
  const [active] = useActivateAtom(index, currentIndexAtom);
  const playing = useAtomValue(timerActiveAtom);
  const color = active
    ? playing
      ? colors.playing
      : colors.selected
    : colors.brand;
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        gap: itemGap,
      }}
    >
      <View style={{ flexDirection: "row", gap: itemGap, width: itemWidth }}>
        <Activate color={color} index={index} />
      </View>
      <ListTimerView id={id} color={color} />
      <View style={{ flexDirection: "row", gap: itemGap, width: itemWidth }}>
        <Remove index={index} color={color} />
        <Duplicate index={index} color={color} />
      </View>
    </View>
  );
});

export function List() {
  const items = useAtomValue(itemsAtom);
  return (
    <FlatList
      contentContainerStyle={{ gap: 5 }}
      data={items}
      renderItem={({ index, item: { id } }) => <Item index={index} id={id} />}
      keyExtractor={({ id }) => id}
    />
  );
}
