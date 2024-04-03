import { z } from "zod";

import { fromError } from "@/utils/fromError";
import { getUUID } from "@/utils/uuid";

const itemSchema = z.object({
  id: z.string(),
  seconds: z.number(),
});

export type Item = z.infer<typeof itemSchema>;

export function getNullItem() {
  return { seconds: 0, id: getUUID() };
}

const timerListSchema = z.object({
  index: z.number(),
  items: z.array(itemSchema),
});

export type TimerList = z.infer<typeof timerListSchema>;

export function getNullTimerList() {
  return { index: 0, items: [getNullItem()] };
}

export const validateTimerListSchema = fromError(timerListSchema.parse);

export function normalize(lists: TimerList) {
  const { index, items } = lists;
  if (index > items.length - 1) lists = { ...lists, index: items.length - 1 };
  if (index < 0) lists = { ...lists, index: 0 };
  if (items.length === 0) lists = getNullTimerList();
  return lists;
}
