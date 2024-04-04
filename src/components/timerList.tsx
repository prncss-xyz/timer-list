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
import {
  removeIdAtom,
  duplicateIdAtom,
  itemsAtom,
  currentIdAtom,
  getIdItemSecondsTextAtom,
} from "@/stores/timerLists";
import { timerActiveAtom } from "@/stores/timers";
import { sizes, colors, styles, borderWidths, spaces } from "@/styles";

function Remove({ timerId, color }: { timerId: string; color: string }) {
  const removeItem = useSetAtom(removeIdAtom);
  const remove = useCallback(() => removeItem(timerId), [removeItem, timerId]);
  return (
    <Pressable
      accessibilityLabel="remove"
      onPress={remove}
      style={styles.iconPlace}
    >
      <Ionicons color={color} name="close-circle-outline" size={sizes.icon} />
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
      accessibilityLabel="duplicate"
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
    <Pressable
      accessibilityLabel="edit"
      onPress={onPress}
      style={styles.iconPlace}
    >
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
    <Pressable accessibilityLabel="duration" onPress={activate}>
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
        borderColor: colors.brand,
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
  const playing = useAtomValue(timerActiveAtom);
  const color = active
    ? playing
      ? colors.playing
      : colors.current
    : colors.brand;
  return (
    <View
      accessibilityLabel={active ? "current" : undefined}
      style={{
        paddingTop: spaces[10],
        paddingBottom: spaces[10],
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
