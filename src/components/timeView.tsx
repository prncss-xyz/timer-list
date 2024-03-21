import { Text } from "react-native";

import { fromSeconds } from "../utils/numbers";

export function TimeView({ value }: { value: number }) {
  return <Text style={{ padding: 5 }}>{fromSeconds(value)}</Text>;
}
