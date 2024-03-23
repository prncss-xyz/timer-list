import { useAtom } from "jotai";
import { useCallback, useMemo, useState } from "react";
import { TextInput } from "react-native";

import { getIdItemSecondsAtom } from "../list";
import { styles } from "../styles";
import { getDebouncer } from "../utils/debouncer";
import { fromSeconds, toSeconds } from "../utils/numbers";

export function TimeInput({ id, color }: { id: string; color?: string }) {
  const [seconds, setSeconds] = useAtom(
    useMemo(() => getIdItemSecondsAtom(id), [id]),
  );
  const debouncedSetseconds = useCallback(getDebouncer(setSeconds, 200), [
    setSeconds,
  ]);
  const [v, setV] = useState(seconds);
  const onTextInput = useCallback(
    (value: string) => {
      const seconds_ = toSeconds(value);
      setV(seconds_);
      debouncedSetseconds(seconds_);
    },
    [setV, debouncedSetseconds],
  );
  return (
    <TextInput
      style={[{ backgroundColor: color }, styles.timeInput]}
      value={fromSeconds(v ?? 0)}
      onChangeText={onTextInput}
      inputMode="decimal"
    />
  );
}
