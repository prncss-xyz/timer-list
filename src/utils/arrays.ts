// since Array.prototype.splice is not available on Hermes

export const insert = <T>(arr: T[], index: number, item: T) => [
  ...arr.slice(0, index),
  item,
  ...arr.slice(index),
];
