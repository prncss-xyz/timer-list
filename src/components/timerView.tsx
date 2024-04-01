import { Text } from "react-native";

import { colors, styles } from "@/styles";

export function TimerView({ color, text }: { color: string; text: string }) {
  return (
    <Text
      style={[
        {
          backgroundColor: color === colors.brand ? colors.background : color,
          borderColor: color,
          color: colors.text,
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
