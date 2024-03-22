import Ionicons from "@expo/vector-icons/Ionicons";
import { useSetAtom, useAtomValue } from "jotai";
import React, { useCallback, memo } from "react";
import { Pressable, View, SafeAreaView, FlatList } from "react-native";

import { TimeInput } from "../components/timeInput";
import { useActivateAtom } from "../hooks/activate";
import {
  removeItemAtom,
  duplicateItemAtom,
  currentIndexAtom,
  itemsAtom,
} from "../list";
import { sizes, colors } from "../styles";
import { resetTimerAtom, isTimerActiveAtom } from "../timers";

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

export function List() {
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
