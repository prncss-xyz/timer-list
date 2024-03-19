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

export function nextValue<T>(xs: T[], cb: (x: T) => boolean) {
  let t: T | undefined;
  let u: T | undefined;
  for (let i = xs.length - 1; i >= 0; i--) {
    u = xs[i];
    if (cb(u)) return t ?? u;
    t = u;
  }
  return u;
}

export function eq<T>(x: T) {
  return (y: T) => x === y;
}
