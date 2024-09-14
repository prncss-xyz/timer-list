import Ionicons from "@expo/vector-icons/Ionicons";
import { useAtomValue, useSetAtom } from "jotai/react";
import React from "react";
import { Pressable, View } from "react-native";

import { TimerView } from "./timerView";

import { useColor } from "@/hooks/color";
import { countDownTextAtom } from "@/stores/countDown";
import {
  resetTimerAtom,
  timerRunningAtom,
  toggleTimerAtom,
} from "@/stores/timers";
import { sizes, spaces, styles } from "@/styles";

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
  const running = useAtomValue(timerRunningAtom);
  const label = running ? "pause" : "play";
  return (
    <Pressable aria-label={label} onPress={toggle} style={styles.iconPlace}>
      <Ionicons color={color} name={label} size={sizes.icon} />
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
  const running = useAtomValue(timerRunningAtom);
  const playing = useColor("playing");
  const activeColor = useColor("active");
  const color = running ? playing : activeColor;
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: spaces[5],
        paddingBottom: 0,
      }}
    >
      <PlayPause color={color} />
      <Countdown color={color} />
      <Reset color={color} />
    </View>
  );
}
