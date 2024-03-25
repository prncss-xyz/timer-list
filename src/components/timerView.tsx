import { Text } from "react-native";

import { colors, styles } from "../styles";

export function TimerView({ color, text }: { color: string; text: string }) {
  return (
    <Text
      style={[
        {
          backgroundColor: color === colors.brand ? colors.background : color,
          borderColor: color,
        },
        styles.timerView,
        styles.baseText,
      ]}
    >
      {text}
    </Text>
  );
}
