import { Item, itemsSchema } from "./model";
import { loadData, saveData } from "../storage";

const key = "list";

// TODO: handle errors
export async function saveItems(items: Item[]) {
  await saveData(key, items);
}

// TODO: handle errors
export async function loadItems() {
  const data = (await loadData(key)) || [];
  return itemsSchema.parse(data);
}
