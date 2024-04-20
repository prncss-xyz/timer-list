import { TimerList } from "./model";

import { insert } from "@/utils/arrays";
import { getUUID } from "@/utils/uuid";

export function duplicateId(id: string) {
  return function (timerList: TimerList): TimerList {
    let { items } = timerList;
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) return timerList;
    const item = { ...items[index], id: getUUID() };
    items = insert(items, index + 1, item);
    timerList = { ...timerList, items };
    if (timerList.active === id) timerList = nextActiveItem(timerList);
    return timerList;
  };
}

export function removeId(id: string) {
  return function (timerList: TimerList): TimerList {
    let { active, items } = timerList;
    if (active === id) {
      let index = items.findIndex((item) => item.id === id);
      if (index + 1 === items.length) index = Math.max(0, index - 1);
      else index = index + 1;
      active = items.at(index)?.id ?? "";
    }
    return {
      ...timerList,
      active,
      items: timerList.items.filter((item) => item.id !== id),
    };
  };
}

export function nextActiveItem(timerList: TimerList): TimerList {
  const { active, items } = timerList;
  let index = items.findIndex((item) => item.id === active);
  index = Math.min(index + 1, items.length - 1);
  return { ...timerList, active: items[index].id };
}
