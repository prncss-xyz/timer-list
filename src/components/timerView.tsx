import { Text } from "react-native";

import { styles } from "@/styles";

export function TimerView({ color, text }: { color: string; text: string }) {
  return (
    <Text
      style={[
        {
          borderColor: color,
          color,
        },
        styles.timerViewBar,
        styles.mono500,
        styles.clockText,
      ]}
    >
      {text}
    </Text>
  );
}
