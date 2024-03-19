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

export function nextId(xs: { id: string }[], id: string) {
  let t = "";
  let u = "";
  for (let i = xs.length - 1; i >= 0; i--) {
    u = xs[i].id;
    if (u === id) return t || u;
    t = u;
  }
  return u;
}
