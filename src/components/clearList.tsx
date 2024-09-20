import { useSetAtom } from "jotai";
import { useCallback } from "react";

import { WideButton } from "./wideButton";

import { useColor } from "@/hooks/color";
import { timerListAtom } from "@/stores/timerLists";
import { getUUID } from "@/utils/uuid";

export function ClearList() {
  const send = useSetAtom(timerListAtom);
  const clear = useCallback(
    () => send({ type: "clear", target: getUUID() }),
    [send],
  );
  const danger = useColor("danger");
  return <WideButton text="clear all" color={danger} onPress={clear} />;
}
