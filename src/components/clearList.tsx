import { useSetAtom } from "jotai";
import { Text, Pressable } from "react-native";

import { clearItemsAtom } from "@/stores/timerLists";
import { styles } from "@/styles";

export function ClearList() {
  const clear = useSetAtom(clearItemsAtom);
  return (
    <Pressable onPress={clear}>
      <Text style={styles.dangerButton}>clear all</Text>
    </Pressable>
  );
}
