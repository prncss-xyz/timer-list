import { prop } from "@constellar/core";
import { focusAtom, viewAtom } from "@constellar/jotai";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useSetAtom, useAtomValue } from "jotai";
import React, { useCallback, memo, useMemo } from "react";
import { Text, Pressable, View, FlatList } from "react-native";

import { useFadeOut } from "./animation";

import { useActivateAtom } from "@/hooks/activateAtom";
import { useColor } from "@/hooks/color";
import {
  activeIdAtom,
  getItemSecondsAtom,
  timerListAtom,
} from "@/stores/timerLists";
import { timerRunningAtom } from "@/stores/timers";
import { sizes, styles, borderWidths, spaces } from "@/styles";
import { secondsString } from "@/utils/seconds";
import { getUUID } from "@/utils/uuid";

function Remove({ timerId, color }: { timerId: string; color: string }) {
  const send = useSetAtom(timerListAtom);
  const remove = useCallback(
    () => send({ type: "remove", source: timerId, target: getUUID() }),
    [send, timerId],
  );
  const cb = useFadeOut(remove);
  return (
    <Pressable aria-label="remove" onPress={cb} style={styles.iconPlace}>
      <Ionicons color={color} name="trash-outline" size={sizes.icon} />
    </Pressable>
  );
}

function Duplicate({ timerId, color }: { timerId: string; color: string }) {
  const send = useSetAtom(timerListAtom);
  const duplicate = useCallback(
    () => send({ type: "duplicate", source: timerId, target: getUUID() }),
    [send, timerId],
  );
  return (
    <Pressable
      aria-label="duplicate"
      onPress={duplicate}
      style={styles.iconPlace}
    >
      <Ionicons color={color} name="add-circle-outline" size={sizes.icon} />
    </Pressable>
  );
}

function Edit({ timerId, color }: { timerId: string; color: string }) {
  const setActiveId = useSetAtom(activeIdAtom);
  const onPress = useCallback(() => {
    router.push(`/set-timer/${timerId}`);
    setActiveId(timerId);
  }, [setActiveId, timerId]);
  return (
    <Pressable aria-label="edit" onPress={onPress} style={styles.iconPlace}>
      <Ionicons name="pencil" size={sizes.icon} color={color} />
    </Pressable>
  );
}

export function Duration({
  timerId,
  color,
}: {
  timerId: string;
  color: string;
}) {
  const navigate = useSetAtom(activeIdAtom);
  const activate = useCallback(() => navigate(timerId), [navigate, timerId]);
  return (
    <Pressable aria-label="duration" onPress={activate}>
      <DurationText color={color} timerId={timerId} />
    </Pressable>
  );
}

export function DurationText({
  color,
  timerId,
}: {
  color: string;
  timerId: string;
}) {
  const itemSecondsAtom = useMemo(() => getItemSecondsAtom(timerId), [timerId]);
  const textAtom = useMemo(
    () => focusAtom(itemSecondsAtom, secondsString),
    [itemSecondsAtom],
  );
  const text = useAtomValue(textAtom);
  return (
    <Text
      style={[
        { color },
        styles.timerViewList,
        styles.mono500,
        styles.clockText,
      ]}
    >
      {text}
    </Text>
  );
}

function Separtor() {
  return (
    <View
      style={{
        width: "100%",
        borderColor: useColor("brand"),
        borderWidth: 0,
        borderBottomWidth: borderWidths.light,
      }}
    />
  );
}

function getColor(active: boolean, timerActive: boolean) {
  if (active) {
    if (timerActive) return "playing";
    return "active";
  }
  return "brand";
}

const Item = memo(({ id }: { id: string }) => {
  const [active] = useActivateAtom(id, activeIdAtom);
  const timerActive = useAtomValue(timerRunningAtom);
  const color = useColor(getColor(active, timerActive));
  return (
    <View
      aria-label={active ? "active" : undefined}
      style={{
        paddingTop: spaces[10],
        paddingBottom: spaces[10],
        paddingLeft: spaces[5],
        paddingRight: spaces[5],
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
      }}
    >
      <Duration timerId={id} color={color} />
      <View
        style={{
          flexDirection: "row",
          gap: spaces[15],
        }}
      >
        <Duplicate timerId={id} color={color} />
        <Remove timerId={id} color={color} />
        <Edit timerId={id} color={color} />
      </View>
    </View>
  );
});

const itemsAtom = viewAtom(timerListAtom, prop("items"));

export function RawTimerList({
  CellRendererComponent,
}: {
  CellRendererComponent?: any;
}) {
  const items = useAtomValue(itemsAtom);
  return (
    <FlatList
      key="timerList"
      contentContainerStyle={{}}
      ItemSeparatorComponent={() => <Separtor />}
      data={items}
      renderItem={({ item: { id } }) => <Item id={id} />}
      keyExtractor={({ id }) => id}
      CellRendererComponent={CellRendererComponent}
    />
  );
}
