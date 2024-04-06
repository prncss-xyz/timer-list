// since Array.prototype.splice is not available everywhere

export const replace = <T>(arr: T[], index: number, item: T) => [
  ...arr.slice(0, index),
  item,
  ...arr.slice(index + 1),
];

export const insert = <T>(arr: T[], index: number, item: T) => [
  ...arr.slice(0, index),
  item,
  ...arr.slice(index),
];

export const remove = <T>(arr: T[], index: number) => [
  ...arr.slice(0, index),
  ...arr.slice(index + 1),
];
