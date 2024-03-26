import Ionicons from "@expo/vector-icons/Ionicons";
import { useAtomValue, useSetAtom } from "jotai/react";
import React from "react";
import { Pressable, View } from "react-native";

import { TimerView } from "./timerView";

import { countDownTextAtom } from "@/stores/countDown";
import {
  resetTimerAtom,
  timerActiveAtom,
  toggleTimerAtom,
} from "@/stores/timers";
import { colors, sizes } from "@/styles";

function Reset({ color }: { color: string }) {
  const reset = useSetAtom(resetTimerAtom);
  return (
    <Pressable onPress={reset}>
      <Ionicons color={color} name="play-skip-back-outline" size={sizes.icon} />
    </Pressable>
  );
}

function PausePlay({ color }: { color: string }) {
  const toggle = useSetAtom(toggleTimerAtom);
  const active = useAtomValue(timerActiveAtom);
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
  const text = useAtomValue(countDownTextAtom);
  return (
    <Pressable onPress={toggle}>
      <TimerView color={color} text={text} />
    </Pressable>
  );
}

export function TimerBar() {
  const active = useAtomValue(timerActiveAtom);
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
