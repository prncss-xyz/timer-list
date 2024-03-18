export function insert<T>(xs: T[], index: number, x: T) {
  const res = [...xs];
  res.splice(index, 0, x);
  return res;
}

export function remove<T>(xs: T[], index: number) {
  const res = [...xs];
  res.splice(index, 1);
  return res;
}
