const message = "unexpected undefined value";

export function defined<T>(or: T, tag = "") {
  return function (r: T | undefined) {
    if (r === undefined) {
      if (__DEV__) {
        console.error(message, tag);
      }
      return or;
    }
    return r;
  };
}
