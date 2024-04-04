import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useSetAtom, useAtomValue } from "jotai";
import React, { useCallback, memo, useMemo } from "react";
import { Text, Pressable, View, FlatList } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LayoutAnimationConfig,
  LinearTransition,
} from "react-native-reanimated";

import { useActivateAtom } from "@/hooks/activateAtom";
import { useColor } from "@/hooks/color";
import {
  removeIdAtom,
  duplicateIdAtom,
  itemsAtom,
  currentIdAtom,
  getIdItemSecondsTextAtom,
} from "@/stores/timerLists";
import { timerActiveAtom } from "@/stores/timers";
import { sizes, styles, borderWidths, spaces } from "@/styles";

function Remove({ timerId, color }: { timerId: string; color: string }) {
  const removeItem = useSetAtom(removeIdAtom);
  const remove = useCallback(() => removeItem(timerId), [removeItem, timerId]);
  return (
    <Pressable aria-label="remove" onPress={remove} style={styles.iconPlace}>
      <Ionicons color={color} name="trash-outline" size={sizes.icon} />
    </Pressable>
  );
}

function Duplicate({ timerId, color }: { timerId: string; color: string }) {
  const duplicateItem = useSetAtom(duplicateIdAtom);
  const duplicate = useCallback(
    () => duplicateItem(timerId),
    [duplicateItem, timerId],
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
  const setCurrentId = useSetAtom(currentIdAtom);
  const onPress = useCallback(() => {
    router.push(`/set-timer/${timerId}`);
    setCurrentId(timerId);
  }, [setCurrentId, timerId]);
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
  const navigate = useSetAtom(currentIdAtom);
  const activate = useCallback(() => navigate(timerId), [navigate, timerId]);
  const text = useAtomValue(
    useMemo(() => getIdItemSecondsTextAtom(timerId), [timerId]),
  );
  return (
    <Pressable aria-label="duration" onPress={activate}>
      <TimerView color={color} text={text} />
    </Pressable>
  );
}

export function TimerView({ color, text }: { color: string; text: string }) {
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

const renderCell = (props: any) => {
  return (
    <Animated.View
      {...props}
      entering={FadeIn}
      exiting={FadeOut}
      style={{ width: "100%" }}
      layout={LinearTransition}
    />
  );
};

const Item = memo(({ id }: { id: string }) => {
  const [active] = useActivateAtom(id, currentIdAtom);
  const timerActive = useAtomValue(timerActiveAtom);
  const playing = useColor("playing");
  const current = useColor("current");
  const brand = useColor("brand");
  const color = active ? (timerActive ? playing : current) : brand;
  return (
    <View
      aria-label={active ? "current" : undefined}
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

export const TimerList = () => {
  const items = useAtomValue(itemsAtom);
  return (
    /* this is not supported on web */
    <LayoutAnimationConfig skipEntering skipExiting>
      <FlatList
        key="timerList"
        contentContainerStyle={{}}
        ItemSeparatorComponent={() => <Separtor />}
        data={items}
        renderItem={({ item: { id } }) => <Item id={id} />}
        keyExtractor={({ id }) => id}
        CellRendererComponent={renderCell}
      />
    </LayoutAnimationConfig>
  );
};
