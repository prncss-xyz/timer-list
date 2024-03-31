import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useSetAtom, useAtomValue } from "jotai";
import React, { useCallback, memo, useMemo } from "react";
import { Text, Pressable, View, FlatList } from "react-native";

import { useActivateAtom } from "@/hooks/activateAtom";
import {
  removeIdAtom,
  duplicateIdAtom,
  itemsAtom,
  currentIdAtom,
  getIdItemSecondsTextAtom,
} from "@/stores/timerLists";
import { timerActiveAtom } from "@/stores/timers";
import { sizes, colors, styles } from "@/styles";

function Remove({ id, color }: { id: string; color: string }) {
  const removeItem = useSetAtom(removeIdAtom);
  const remove = useCallback(() => removeItem(id), [removeItem, id]);
  return (
    <Pressable onPress={remove} style={styles.iconPlace}>
      <Ionicons color={color} name="close-circle-outline" size={sizes.icon} />
    </Pressable>
  );
}

function Duplicate({ id, color }: { id: string; color: string }) {
  const duplicateItem = useSetAtom(duplicateIdAtom);
  const duplicate = useCallback(() => duplicateItem(id), [duplicateItem, id]);
  return (
    <Pressable onPress={duplicate} style={styles.iconPlace}>
      <Ionicons color={color} name="add-circle-outline" size={sizes.icon} />
    </Pressable>
  );
}

function Edit({ id, color }: { id: string; color: string }) {
  const setCurrentId = useSetAtom(currentIdAtom);
  const onPress = useCallback(() => {
    router.push(`/set-timer/${id}`);
    setCurrentId(id);
  }, [setCurrentId, id]);
  return (
    <Pressable onPress={onPress} style={styles.iconPlace}>
      <Ionicons name="pencil" size={sizes.icon} color={color} />
    </Pressable>
  );
}

export function Count({ id, color }: { id: string; color: string }) {
  const navigate = useSetAtom(currentIdAtom);
  const activate = useCallback(() => navigate(id), [navigate, id]);
  const text = useAtomValue(useMemo(() => getIdItemSecondsTextAtom(id), [id]));
  return (
    <Pressable onPress={activate}>
      <TimerView color={color} text={text} />
    </Pressable>
  );
}

export function TimerView({ color, text }: { color: string; text: string }) {
  return (
    <Text style={[{ color }, styles.timerViewList, styles.clockText]}>
      {text}
    </Text>
  );
}

function Separtor() {
  return (
    <View
      style={{
        width: "100%",
        borderColor: colors.brand,
        borderWidth: 0.5,
      }}
    />
  );
}

const Item = memo(({ id }: { id: string }) => {
  const [active] = useActivateAtom(id, currentIdAtom);
  const playing = useAtomValue(timerActiveAtom);
  const color = active
    ? playing
      ? colors.playing
      : colors.selected
    : colors.brand;
  return (
    <View
      style={{
        padding: 10,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        gap: 15,
      }}
    >
      <View style={{ flex: 1 }}>
        <Count id={id} color={color} />
      </View>
      <Remove id={id} color={color} />
      <Duplicate id={id} color={color} />
      <Edit color={color} id={id} />
    </View>
  );
});

export function TimerList() {
  const items = useAtomValue(itemsAtom);
  return (
    <FlatList
      contentContainerStyle={{}}
      ItemSeparatorComponent={() => <Separtor />}
      data={items}
      renderItem={({ item: { id } }) => <Item id={id} />}
      keyExtractor={({ id }) => id}
    />
  );
}
