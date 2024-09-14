import { rewrite } from "@constellar/core";
import { focusAtom } from "@constellar/jotai";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Provider, atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import React, { ReactNode, useCallback, useMemo } from "react";
import { Pressable, Text, View } from "react-native";

import { WideButton } from "./wideButton";

import { HeadSeparator } from "@/components/headSeparator";
import { TimerView } from "@/components/timerView";
import { useColor } from "@/hooks/color";
import { getIdItemSecondsTextAtom } from "@/stores/timerLists";
import { borderWidths, fontSizes, sizes, spaces, styles } from "@/styles";
import { normalizeSeconds } from "@/utils/seconds";

const rawTextAtom = atom("");
const textAtom = focusAtom(rawTextAtom, rewrite(normalizeSeconds));
const updateAtom = atom(null, (get, _set, cb: (text: string) => void) => {
  cb(get(textAtom));
});

function Hydrator({ text, children }: { text: string; children: ReactNode }) {
  useHydrateAtoms([[rawTextAtom, text]]);
  return children;
}

function appendText(text: string) {
  return (str: string) => str + text;
}

function backspaceText(str: string) {
  return str.slice(0, -1);
}

function Timer() {
  const text = useAtomValue(textAtom);
  return (
    <View aria-label="timer">
      <TimerView color={useColor("brand")} text={text} />
    </View>
  );
}

function Cancel() {
  return (
    <Pressable
      aria-label="cancel"
      onPress={router.back}
      style={styles.iconPlace}
    >
      <Ionicons color={useColor("brand")} name="close" size={sizes.icon} />
    </Pressable>
  );
}

function ListBar() {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        alignItems: "flex-start",
        padding: spaces[5],
        paddingBottom: 0,
      }}
    >
      <View style={{ width: sizes.icon }} />
      <Timer />
      <Cancel />
    </View>
  );
}

function Digit({ text }: { text: string }) {
  const setText = useSetAtom(textAtom);
  const onPress = useCallback(() => setText(appendText(text)), [setText, text]);
  const brand = useColor("brand");
  return (
    <Pressable
      aria-label={`digit ${text}`}
      onPress={onPress}
      style={{
        width: sizes.digit,
        height: sizes.digit,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderColor: brand,
        borderStyle: "solid",
        borderWidth: borderWidths.light,
      }}
    >
      <Text style={[styles.mono500, { fontSize: fontSizes[20], color: brand }]}>
        {text}
      </Text>
    </Pressable>
  );
}

function Backspace() {
  const setText = useSetAtom(textAtom);
  const onPress = useCallback(() => setText(backspaceText), [setText]);
  return (
    <Pressable
      onPress={onPress}
      aria-label="backspace"
      style={{
        width: sizes.digit,
        height: sizes.digit,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ionicons color={useColor("brand")} name="backspace" size={sizes.digit} />
    </Pressable>
  );
}

function Done({ setText }: { setText: (text: string) => void }) {
  const update = useSetAtom(updateAtom);
  const onPress = useCallback(() => {
    update(setText);
    router.back();
  }, [setText, update]);
  const active = useColor("active");
  return <WideButton onPress={onPress} color={active} text="done" />;
}

function Grid() {
  const gap = spaces[15];
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap,
        maxWidth: 2 * gap + 3 * sizes.digit,
      }}
    >
      <Digit text="1" />
      <Digit text="2" />
      <Digit text="3" />
      <Digit text="4" />
      <Digit text="5" />
      <Digit text="6" />
      <Digit text="7" />
      <Digit text="8" />
      <Digit text="9" />
      <Digit text="00" />
      <Digit text="0" />
      <Backspace />
    </View>
  );
}

export function SetTimer({ timerId }: { timerId: string }) {
  const [text, setText] = useAtom(
    useMemo(() => getIdItemSecondsTextAtom(timerId), [timerId]),
  );
  if (text === undefined) return null;
  return (
    <Provider>
      {/* we can only pass serializable values, hence setText is not passed as an atom here, but as a prop later on */}
      <Hydrator text={text}>
        <ListBar />
        <HeadSeparator />
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid />
        </View>
        <Done setText={setText} />
      </Hydrator>
    </Provider>
  );
}
