import { useSetAtom } from "jotai";

import { WideButton } from "./wideButton";

import { useColor } from "@/hooks/color";
import { clearItemsAtom } from "@/stores/timerLists";

export function ClearList() {
  const clear = useSetAtom(clearItemsAtom);
  const danger = useColor("danger");
  return <WideButton text="clear all" color={danger} onPress={clear} />;
}
