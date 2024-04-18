import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useSetAtom, useAtomValue } from "jotai";
import React, {
  createContext,
  useCallback,
  memo,
  useMemo,
  useRef,
  useEffect,
  ReactNode,
  MutableRefObject,
  useContext,
} from "react";
import { Text, Pressable, View, FlatList, Animated } from "react-native";

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

const FadeOutCtx = createContext((_cb: () => void) => {});

function useFadeOut(cb: () => void) {
  const exitCb = useContext(FadeOutCtx);
  return useCallback(() => exitCb(cb), [cb, exitCb]);
}

const duration = 300;
/* const useNativeDriver = Platform.OS !== "web"; */
const useNativeDriver = false;

const ShouldAnimateContext = createContext<MutableRefObject<boolean>>({
  current: true,
});

function useShouldAnimate() {
  const ref = useContext(ShouldAnimateContext);
  return ref.current;
}

function SkipAnimateOnMount({ children }: { children: ReactNode }) {
  const mounting = useRef(false);
  useEffect(() => {
    mounting.current = true;
  }, []);
  return (
    <ShouldAnimateContext.Provider value={mounting}>
      {children}
    </ShouldAnimateContext.Provider>
  );
}

function ListAnim({ children }: { children: ReactNode }) {
  const animate = useShouldAnimate();
  const opacity = useRef(new Animated.Value(animate ? 0 : 1)).current;
  const height = useRef(
    new Animated.Value(animate ? 0 : sizes.listHeight),
  ).current;
  useEffect(() => {
    if (!animate) return;
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        useNativeDriver,
      }),
      Animated.timing(height, {
        toValue: sizes.listHeight,
        duration,
        useNativeDriver,
      }),
    ]).start();
  }, [animate, opacity, height]);
  const value = useCallback(
    (cb: () => void) => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration,
          useNativeDriver,
        }),
        Animated.timing(height, {
          toValue: 0,
          duration,
          useNativeDriver,
        }),
      ]).start(cb);
    },
    [opacity, height],
  );
  return (
    <FadeOutCtx.Provider value={value}>
      <Animated.View style={{ opacity, height }}>{children}</Animated.View>
    </FadeOutCtx.Provider>
  );
}

function Remove({ timerId, color }: { timerId: string; color: string }) {
  const removeItem = useSetAtom(removeIdAtom);
  const remove = useCallback(() => removeItem(timerId), [removeItem, timerId]);
  const cb = useFadeOut(remove);
  return (
    <Pressable aria-label="remove" onPress={cb} style={styles.iconPlace}>
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

const Item = memo(({ id }: { id: string }) => {
  const [active] = useActivateAtom(id, currentIdAtom);
  const timerActive = useAtomValue(timerActiveAtom);
  const playing = useColor("playing");
  const current = useColor("current");
  const brand = useColor("brand");
  const color = active ? (timerActive ? playing : current) : brand;
  return (
    <ListAnim>
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
    </ListAnim>
  );
});

export const TimerList = () => {
  const items = useAtomValue(itemsAtom);
  return (
    <SkipAnimateOnMount>
      <FlatList
        key="timerList"
        contentContainerStyle={{}}
        ItemSeparatorComponent={() => <Separtor />}
        data={items}
        renderItem={({ item: { id } }) => <Item id={id} />}
        keyExtractor={({ id }) => id}
      />
    </SkipAnimateOnMount>
  );
};
