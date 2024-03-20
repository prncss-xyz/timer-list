import { Item, itemsSchema } from "./model";
import { loadData, saveData } from "../storage";

const key = "list";

// TODO: handle errors
export async function saveItems(items: Item[]) {
  // __AUTO_GENERATED_PRINT_VAR_START__
  console.log("saveItems items: %s", items); // __AUTO_GENERATED_PRINT_VAR_END__
  await saveData(key, items);
}

// TODO: handle errors
export async function loadItems() {
  const data = (await loadData(key)) || [];
  // __AUTO_GENERATED_PRINT_VAR_START__
  console.log("loadItems data: %s", data); // __AUTO_GENERATED_PRINT_VAR_END__
  return itemsSchema.parse(data);
}
