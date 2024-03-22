import Ionicons from "@expo/vector-icons/Ionicons";
import { useAtomValue, useSetAtom } from "jotai/react";
import React from "react";
import { Pressable, View } from "react-native";

import { BaseText } from "./baseText";
import { colors, sizes } from "../styles";
import {
  isTimerActiveAtom,
  resetTimerAtom,
  roundedTimerSecondsAtom,
  toggleTimerAtom,
} from "../timers";
import { fromSeconds } from "../utils/numbers";

function Reset({ color }: { color: string }) {
  const reset = useSetAtom(resetTimerAtom);
  return (
    <Pressable onPress={reset}>
      <Ionicons color={color} name="play-skip-back-outline" size={20} />
    </Pressable>
  );
}

function PausePlay({ color }: { color: string }) {
  const toggle = useSetAtom(toggleTimerAtom);
  const active = useAtomValue(isTimerActiveAtom);
  return (
    <Pressable onPress={toggle}>
      <Ionicons
        color={color}
        name={active ? "pause" : "play"}
        size={sizes.icon}
      />
    </Pressable>
  );
}

function Count({ color }: { color: string }) {
  const toggle = useSetAtom(toggleTimerAtom);
  const seconds = useAtomValue(roundedTimerSecondsAtom);
  return (
    <Pressable onPress={toggle}>
      <View
        style={{
          backgroundColor: color,
          borderColor: color,
          borderWidth: 1,
          borderStyle: "solid",
          padding: 5,
        }}
      >
        <BaseText>{fromSeconds(seconds)}</BaseText>
      </View>
    </Pressable>
  );
}

export function TimerBar() {
  const active = useAtomValue(isTimerActiveAtom);
  const color = active ? colors.playing : colors.selected;
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
      }}
    >
      <PausePlay color={color} />
      <Count color={color} />
      <Reset color={color} />
    </View>
  );
}
