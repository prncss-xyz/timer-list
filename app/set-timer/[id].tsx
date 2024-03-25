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
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Pressable, Text, View } from "react-native";

import { HeadSeparator } from "../../src/components/headSeparator";
import { TimerView } from "../../src/components/timerView";
import { getIdItemSecondsAtom } from "../../src/list";
import { borderWidths, colors, sizes, spaces, styles } from "../../src/styles";
import {
  fromSeconds,
  normalizeSeconds,
  toSeconds,
} from "../../src/utils/seconds";

const InitialTextScope = createScope({
  seconds: 0,
  onChange: (_seconds: number) => {},
});

// we use a ref/effect to make sure value updates only when page unmounts
// a more naive approach (update each time ScopeProvider unmounts) causes an infinite rerendering cycle
// if an external events causes secondsAtom to update
// this is not happening in the current state of application but felt it would impaired maintenability
function TextScope({ children }: { children: ReactNode }) {
  const id = String(useLocalSearchParams().id);
  const [seconds, setSeconds] = useAtom(
    useMemo(() => getIdItemSecondsAtom(id), [id]),
  );
  const secondsRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    return () => {
      const { current } = secondsRef;
      if (current === undefined) return;
      setSeconds(current);
    };
  }, [secondsRef, setSeconds]);
  return (
    <ScopeProvider
      scope={InitialTextScope}
      value={{
        seconds: seconds ?? 0,
        onChange: (value: number) => (secondsRef.current = value),
      }}
    >
      {children}
    </ScopeProvider>
  );
}

const textMolecule = molecule((_getMol, getScope) => {
  const { seconds, onChange } = getScope(InitialTextScope);
  const rawTextAtom = atom(fromSeconds(seconds));
  const textAtom = atom(
    (get) => get(rawTextAtom),
    (get, set, cb: (text: string) => string) => {
      const value = normalizeSeconds(cb(get(rawTextAtom)));
      onChange(toSeconds(value));
      return set(rawTextAtom, value);
    },
  );
  return textAtom;
});

function appendText(text: string) {
  return (str: string) => str + text;
}

function backspaceText(str: string) {
  return str.slice(0, -1);
}

function clearText() {
  return "";
}

function Count() {
  const text = useAtomValue(useMolecule(textMolecule));
  return <TimerView color={colors.brand} text={text} />;
}

function Close() {
  return (
    <Pressable onPress={router.back}>
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
      <Count />
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
        width: sizes.icon,
        height: sizes.icon,
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
  const setText = useSetAtom(useMolecule(textMolecule));
  const onPress = useCallback(() => setText(appendText(text)), [setText, text]);
  return (
    <DigitButton onPress={onPress}>
      <Text style={styles.baseText}>{text}</Text>
    </DigitButton>
  );
}

function Backspace() {
  const setText = useSetAtom(useMolecule(textMolecule));
  const onPress = useCallback(() => setText(backspaceText), [setText]);
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: sizes.icon,
        height: sizes.icon,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ionicons color={colors.brand} name="backspace" size={sizes.icon} />
    </Pressable>
  );
}

function ClearTimer() {
  const setText = useSetAtom(useMolecule(textMolecule));
  const onPress = useCallback(() => setText(clearText), [setText]);
  return (
    <Pressable onPress={onPress}>
      <Text style={styles.dangerButton}>clear</Text>
    </Pressable>
  );
}

function Row({ children }: { children: ReactNode }) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: spaces.gridGap,
      }}
    >
      {children}
    </View>
  );
}

function Grid() {
  return (
    <View
      style={{
        flexDirection: "column",
        gap: spaces.gridGap,
      }}
    >
      <Row>
        <Digit text="1" />
        <Digit text="2" />
        <Digit text="3" />
      </Row>
      <Row>
        <Digit text="4" />
        <Digit text="5" />
        <Digit text="6" />
      </Row>
      <Row>
        <Digit text="7" />
        <Digit text="8" />
        <Digit text="9" />
      </Row>
      <Row>
        <Digit text="00" />
        <Digit text="0" />
        <Backspace />
      </Row>
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
      <ClearTimer />
    </TextScope>
  );
}
