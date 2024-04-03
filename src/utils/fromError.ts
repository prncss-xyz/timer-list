export function fromError<T, U>(cb: (t: T) => U) {
  return function (t: T) {
    try {
      return cb(t);
    } catch {}
  };
}
