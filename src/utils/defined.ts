const message = "unexpected undefined value";

export function defined<T>(or: T) {
  return function (r: T | undefined) {
    if (r === undefined) {
      if (__DEV__) {
        throw new Error(message);
      }
      console.error(message);
      return or;
    }
    return r;
  };
}
