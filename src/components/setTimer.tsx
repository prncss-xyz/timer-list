import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Provider, atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { focusAtom } from "jotai-optics";
import React, { ReactNode, useCallback, useMemo } from "react";
import { Pressable, Text, View } from "react-native";

import { HeadSeparator } from "@/components/headSeparator";
import { TimerView } from "@/components/timerView";
import { getIdItemSecondsTextAtom } from "@/stores/timerLists";
import {
  borderWidths,
  colors,
  fontSizes,
  sizes,
  spaces,
  styles,
} from "@/styles";
import { normalizeSeconds } from "@/utils/seconds";

const rawTextAtom = atom("");
const textAtom = focusAtom(rawTextAtom, (o) => o.rewrite(normalizeSeconds));
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
    <View accessibilityLabel="timer">
      <TimerView color={colors.brand} text={text} />
    </View>
  );
}

function Cancel() {
  return (
    <Pressable
      accessibilityLabel="cancel"
      onPress={router.back}
      style={styles.iconPlace}
    >
      <Ionicons color={colors.brand} name="close" size={sizes.icon} />
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
        alignItems: "flex-end",
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
  return (
    <Pressable
      accessibilityLabel={`digit ${text}`}
      onPress={onPress}
      style={{
        width: sizes.digit,
        height: sizes.digit,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderColor: colors.brand,
        borderStyle: "solid",
        borderWidth: borderWidths.light,
      }}
    >
      <Text
        style={[
          styles.mono500,
          { fontSize: fontSizes[20], color: colors.brand },
        ]}
      >
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
      accessibilityLabel="backspace"
      style={{
        width: sizes.digit,
        height: sizes.digit,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ionicons color={colors.brand} name="backspace" size={sizes.digit} />
    </Pressable>
  );
}

function Done({ setText }: { setText: (text: string) => void }) {
  const update = useSetAtom(updateAtom);
  const onPress = useCallback(() => {
    update(setText);
    router.back();
  }, [update]);
  return (
    <Pressable onPress={onPress} accessibilityLabel="done">
      <Text
        style={[
          styles.button,
          { color: colors.selected, borderColor: colors.selected },
        ]}
      >
        done
      </Text>
    </Pressable>
  );
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
