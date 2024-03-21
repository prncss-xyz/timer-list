import { z } from "zod";

import { getUUID } from "../utils/uuid";

const itemSchema = z.object({
  id: z.string(),
  seconds: z.number(),
});
export type Item = z.infer<typeof itemSchema>;
export const nullItem: Item = { seconds: 0, id: getUUID() };

const listsSchema = z.object({
  index: z.number(),
  items: z.array(itemSchema),
});
export type Lists = z.infer<typeof listsSchema>;
export const nullLists: Lists = { index: 0, items: [nullItem] };

export const validateListsSchema = (v: unknown) => listsSchema.parse(v);
