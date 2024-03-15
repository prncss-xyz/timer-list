import { StatusBar } from "expo-status-bar";
import { WritableAtom, atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomEffect } from "jotai-effect";
import { useCallback } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";

// @ts-ignore
import duckSound from "./assets/duck.mp3";
import { loadSoundAtom, playSoundAtom } from "./src/sound";

type TimerStopped = {
  type: "timer_stopped";
  delai: number;
};
type TimerAcive = {
  type: "timer_active";
  event: number;
};
type Timer = TimerStopped | TimerAcive;
function stop(timer: TimerAcive, now: number): TimerStopped {
  return { type: "timer_stopped", delai: timer.event - now };
}
function start(timer: TimerStopped, now: number): TimerAcive {
  return { type: "timer_active", event: timer.delai + now };
}

function timerToggle(timer: Timer, now: number): Timer {
  if (timer.type === "timer_active") return stop(timer, now);
  return start(timer, now);
}
function setDelai(timer: Timer, delai: number, now: number): Timer {
  const t: TimerStopped = { type: "timer_stopped", delai };
  if (timer.type === "timer_active") return start(t, now);
  return t;
}
function getDelai(timer: Timer, now: number) {
  const t = timer.type === "timer_stopped" ? timer : stop(timer, now);
  return t.delai;
}

const second = 1000;
const resolution = 200;
const delai = 3000;

const nowAtom = atom(0);
nowAtom.onMount = (setAtom) => {
  const timer = setInterval(() => {
    return setAtom(Date.now());
  }, resolution);
  return () => clearInterval(timer);
};

const timerAtom = atom<Timer>({
  type: "timer_stopped",
  delai,
});

const resetAtom = atom(null, (get, set) =>
  set(timerAtom, setDelai(get(timerAtom), delai, get(nowAtom))),
);

const delaiPositiveAtom = atom(
  (get) => Math.max(0, getDelai(get(timerAtom), get(nowAtom))),
  (get, set, value: number) =>
    set(timerAtom, setDelai(get(timerAtom), value, get(nowAtom))),
);

const toggleAtom = atom(null, (get, set) => {
  set(timerAtom, timerToggle(get(timerAtom), get(nowAtom)));
});

const activeAtom = atom((get) => get(timerAtom).type === "timer_active");

const getAlarmEffect = (ringAtom: WritableAtom<null, [], void>) =>
  atomEffect((get, set) => {
    const timer = get(timerAtom);
    if (timer.type === "timer_stopped") return;
    const now = get(nowAtom);
    if (getDelai(timer, now) > 0) return;
    set(timerAtom, stop(timer, now));
    set(resetAtom);
    set(ringAtom);
  });

const alarmEffect = getAlarmEffect(playSoundAtom);

function Reset() {
  const setDelai = useSetAtom(delaiPositiveAtom);
  const reset = useCallback(() => setDelai(delai), [delai]);
  return (
    <Pressable onPress={reset}>
      <Text>Reset</Text>
    </Pressable>
  );
}

function Count() {
  const toggle = useSetAtom(toggleAtom);
  const active = useAtomValue(activeAtom);
  const delai = useAtomValue(delaiPositiveAtom);
  const seconds = Math.ceil(delai / second);
  return (
    <Pressable onPress={toggle}>
      <View
        style={{
          backgroundColor: active ? "yellow" : "lightblue",
        }}
      >
        <Text
          style={{
            padding: 5,
          }}
        >
          {seconds}
        </Text>
      </View>
    </Pressable>
  );
}

export default function App() {
  useSetAtom(loadSoundAtom)(duckSound);
  useAtom(alarmEffect);
  return (
    <View style={styles.container}>
      <Count />
      <Reset />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
