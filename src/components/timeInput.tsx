import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { TextInput } from "react-native";

import { getIdItemSecondsAtom } from "../list";
import { fromSeconds, toSeconds } from "../utils/numbers";

export function TimeInput({ id, color }: { id: string; color?: string }) {
  const [seconds, setSeconds] = useAtom(
    useMemo(() => getIdItemSecondsAtom(id), [id]),
  );
  const onTextInput = useCallback(
    (value: string) => {
      const seconds_ = toSeconds(value);
      setSeconds(seconds_);
    },
    [setSeconds],
  );
  return (
    <TextInput
      style={{
        fontFamily: "Inter_400Regular",
        fontSize: 16,
        textAlign: "center",
        padding: 5,
        backgroundColor: color,
      }}
      value={fromSeconds(seconds ?? 0)}
      onChangeText={onTextInput}
      inputMode="decimal"
    />
  );
}
