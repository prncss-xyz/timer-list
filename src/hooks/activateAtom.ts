import { WritableAtom, useAtom } from "jotai";
import { useMemo } from "react";

import { activateAtom } from "@/utils/atoms";

export function useActivateAtom<Value, Result>(
  value: Value,
  inputAtom: WritableAtom<Value, [value: Value], Result>,
) {
  return useAtom(
    useMemo(() => activateAtom(value, inputAtom), [value, inputAtom]),
  );
}
