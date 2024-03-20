import { z } from "zod";

export const itemSchema = z.object({ seconds: z.number() });
export type Item = z.infer<typeof itemSchema>;
export const nullItem: Item = { seconds: 0 };

export const itemsSchema = z.array(itemSchema);
