import { Text, Pressable } from "react-native";

import { spaces, styles } from "@/styles";

export function WideButton({
  color,
  text,
  onPress,
}: {
  color: string;
  text: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      aria-label={text}
      onPress={onPress}
      style={{ padding: spaces[5] }}
    >
      <Text style={[styles.button, { color, borderColor: color }]}>{text}</Text>
    </Pressable>
  );
}
