import { useCallback } from "react";
import { TextInput } from "react-native";

import { fromSeconds, toSeconds } from "../utils/numbers";

export function TimeInput({
  active,
  value,
  setValue,
}: {
  active: boolean;
  value: number;
  setValue: (v: number) => void;
}) {
  const onTextInput = useCallback(
    (value: string) => {
      const seconds_ = toSeconds(value);
      setValue(seconds_);
    },
    [setValue],
  );
  return (
    <TextInput
      style={{ padding: 5, backgroundColor: active ? "green" : "blue" }}
      value={fromSeconds(value)}
      onChangeText={onTextInput}
      inputMode="decimal"
    />
  );
}
