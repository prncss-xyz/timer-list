import Ionicons from "@expo/vector-icons/Ionicons";
// https://github.com/saasquatch/bunshi/issues/41
import {
  createScope,
  molecule,
  ScopeProvider,
  useMolecule,
} from "bunshi/dist/react";
import { router, useLocalSearchParams } from "expo-router";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { focusAtom } from "jotai-optics";
import React, { ReactNode, useCallback, useMemo } from "react";
import { Pressable, Text, View } from "react-native";

import { HeadSeparator } from "@/components/headSeparator";
import { TimerView } from "@/components/timerView";
import { getIdItemSecondsAtom } from "@/stores/timerLists";
import {
  borderWidths,
  colors,
  fontSizes,
  sizes,
  spaces,
  styles,
} from "@/styles";
import { fromSeconds, normalizeSeconds, toSeconds } from "@/utils/seconds";

const InitialTextScope = createScope({
  seconds: 0,
  setSeconds: (_seconds: number) => {},
});

const textMolecule = molecule((_getMol, getScope) => {
  const { seconds, setSeconds } = getScope(InitialTextScope);
  const rawTextAtom = atom(fromSeconds(seconds));
  const textAtom = focusAtom(rawTextAtom, (o) => o.rewrite(normalizeSeconds));
  const updateAtom = atom(null, (get) => {
    setSeconds(toSeconds(get(textAtom)));
  });
  return { textAtom, updateAtom };
});

function TextScope({ children }: { children: ReactNode }) {
  const id = String(useLocalSearchParams().id);
  const [seconds, setSeconds] = useAtom(
    useMemo(() => getIdItemSecondsAtom(id), [id]),
  );
  return (
    <ScopeProvider
      scope={InitialTextScope}
      value={{
        seconds,
        setSeconds,
      }}
    >
      {children}
    </ScopeProvider>
  );
}

function appendText(text: string) {
  return (str: string) => str + text;
}

function backspaceText(str: string) {
  return str.slice(0, -1);
}

function Timer() {
  const text = useAtomValue(useMolecule(textMolecule).textAtom);
  return <TimerView color={colors.brand} text={text} />;
}

function Close() {
  return (
    <Pressable onPress={router.back} style={styles.iconPlace}>
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
      <Close />
    </View>
  );
}

function DigitButton({
  children,
  onPress,
}: {
  children: ReactNode;
  onPress: () => void;
}) {
  return (
    <Pressable
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
      {children}
    </Pressable>
  );
}

function Digit({ text }: { text: string }) {
  const setText = useSetAtom(useMolecule(textMolecule).textAtom);
  const onPress = useCallback(() => setText(appendText(text)), [setText, text]);
  return (
    <DigitButton onPress={onPress}>
      <Text
        style={[
          styles.mono500,
          { fontSize: fontSizes[20], color: colors.brand },
        ]}
      >
        {text}
      </Text>
    </DigitButton>
  );
}

function Backspace() {
  const setText = useSetAtom(useMolecule(textMolecule).textAtom);
  const onPress = useCallback(() => setText(backspaceText), [setText]);
  return (
    <Pressable
      onPress={onPress}
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

function Done() {
  const update = useSetAtom(useMolecule(textMolecule).updateAtom);
  const onPress = useCallback(() => {
    update();
    router.back();
  }, [update]);
  return (
    <Pressable onPress={onPress}>
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

function ClearTimer() {
  const setText = useSetAtom(useMolecule(textMolecule).textAtom);
  const onPress = useCallback(() => setText(""), [setText]);
  return (
    <Pressable onPress={onPress}>
      <Text style={styles.button}>clear</Text>
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

export default function Page() {
  return (
    <TextScope>
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
      <Done />
      {/* <ClearTimer /> */}
    </TextScope>
  );
}
