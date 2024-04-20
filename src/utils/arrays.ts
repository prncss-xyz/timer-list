// since Array.prototype.splice is not available everywhere

export const insert = <T>(arr: T[], index: number, item: T) => [
  ...arr.slice(0, index),
  item,
  ...arr.slice(index),
];
