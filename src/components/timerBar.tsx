import Ionicons from "@expo/vector-icons/Ionicons";
import { useAtomValue, useSetAtom } from "jotai/react";
import React from "react";
import { Pressable, View } from "react-native";

import { TimerView } from "./timerView";

import { useColor } from "@/hooks/color";
import { countDownTextAtom } from "@/stores/countDown";
import {
  resetTimerAtom,
  timerActiveAtom,
  toggleTimerAtom,
} from "@/stores/timers";
import { sizes, styles } from "@/styles";

function Reset({ color }: { color: string }) {
  const reset = useSetAtom(resetTimerAtom);
  return (
    <Pressable aria-label="reset" onPress={reset} style={styles.iconPlace}>
      <Ionicons color={color} name="play-skip-back-outline" size={sizes.icon} />
    </Pressable>
  );
}

function PlayPause({ color }: { color: string }) {
  const toggle = useSetAtom(toggleTimerAtom);
  const active = useAtomValue(timerActiveAtom);
  return (
    <Pressable
      aria-label={active ? "pause" : "play"}
      onPress={toggle}
      style={styles.iconPlace}
    >
      <Ionicons
        color={color}
        name={active ? "pause" : "play"}
        size={sizes.icon}
      />
    </Pressable>
  );
}

function Countdown({ color }: { color: string }) {
  const toggle = useSetAtom(toggleTimerAtom);
  const text = useAtomValue(countDownTextAtom);
  return (
    <Pressable aria-label="countdown" onPress={toggle}>
      <TimerView color={color} text={text} />
    </Pressable>
  );
}

export function TimerBar() {
  const active = useAtomValue(timerActiveAtom);
  const playing = useColor("playing");
  const current = useColor("current");
  const color = active ? playing : current;
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <PlayPause color={color} />
      <Countdown color={color} />
      <Reset color={color} />
    </View>
  );
}
