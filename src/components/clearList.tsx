import { useSetAtom } from "jotai";
import { Text, Pressable } from "react-native";

import { clearItemsAtom } from "@/stores/timerLists";
import { colors, styles } from "@/styles";

export function ClearList() {
  const clear = useSetAtom(clearItemsAtom);
  return (
    <Pressable onPress={clear}>
      <Text
        style={[
          styles.button,
          { color: colors.danger, borderColor: colors.danger },
        ]}
      >
        clear all
      </Text>
    </Pressable>
  );
}
