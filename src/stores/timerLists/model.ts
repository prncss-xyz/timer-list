import { z } from "zod";

import { fromError } from "@/utils/fromError";
import { getUUID } from "@/utils/uuid";

const itemSchema = z.object({
  id: z.string(),
  seconds: z.number(),
});

export type Item = z.infer<typeof itemSchema>;

export function getBasicItem() {
  return { seconds: 0, id: getUUID() };
}

const timerListSchema = z.object({
  active: z.string(),
  items: z.array(itemSchema),
});

export type TimerList = z.infer<typeof timerListSchema>;

function getBasicTimerList() {
  const item = getBasicItem();
  return { active: item.id, items: [item] };
}

export const validateTimerListSchema = fromError(timerListSchema.parse);

export function normalize(timerList: TimerList): TimerList {
  const { items } = timerList;
  if (items.length === 0) timerList = getBasicTimerList();
  return timerList;
}
