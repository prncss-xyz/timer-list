import { timerListAtom } from ".";
import { validateTimerListSchema } from "./model";

import { useStorageAtom } from "@/hooks/storage";

export function useInitTimerListStorage(key: string) {
  return useStorageAtom(key, timerListAtom, validateTimerListSchema);
}
