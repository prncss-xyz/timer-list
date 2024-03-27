import { z } from "zod";

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

export const validateTimerListSchema = (v: unknown) => {
  try {
    return timerListSchema.parse(v);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {}
};
