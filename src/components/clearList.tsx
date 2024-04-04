import { useSetAtom } from "jotai";
import { Text, Pressable } from "react-native";

import { useColor } from "@/hooks/color";
import { clearItemsAtom } from "@/stores/timerLists";
import { styles } from "@/styles";

export function ClearList() {
  const clear = useSetAtom(clearItemsAtom);
  const danger = useColor("danger");
  return (
    <Pressable aria-label="clear all" onPress={clear}>
      <Text style={[styles.button, { color: danger, borderColor: danger }]}>
        clear all
      </Text>
    </Pressable>
  );
}
