import { insert } from "@/utils/arrays";

export type Item = {
  id: string;
  seconds: number;
};

export type TimerList = {
  active: string;
  items: Item[];
};

export function duplicate(
  {
    source,
    target,
  }: {
    source: string;
    target: string;
  },
  timerList: TimerList,
) {
  let { items } = timerList;
  const index = items.findIndex((item) => item.id === source);
  if (index < 0) return timerList;
  const item = { ...items[index], id: target };
  items = insert(items, index + 1, item);
  timerList = { ...timerList, items };
  if (timerList.active === source) timerList = next({}, timerList);
  return timerList;
}

export function clear({ target }: { target: string }) {
  return {
    active: target,
    items: [{ seconds: 0, id: target }],
  };
}

export function remove(
  { source, target }: { source: string; target: string },
  timerList: TimerList,
) {
  let { active, items } = timerList;
  if (items.length <= 1) return clear({ target });
  if (active === source) {
    let index = items.findIndex((item) => item.id === source);
    if (index + 1 === items.length) index = Math.max(0, index - 1);
    else index = index + 1;
    active = items[index].id;
  }
  return {
    ...timerList,
    active,
    items: timerList.items.filter((item) => item.id !== source),
  };
}

export function next(_: unknown, timerList: TimerList): TimerList {
  const { active, items } = timerList;
  let index = items.findIndex((item) => item.id === active);
  index = Math.min(index + 1, items.length - 1);
  return { ...timerList, active: items[index].id };
}
