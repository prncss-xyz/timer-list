export function getDebouncer<T>(cb: (arg: T) => void, delai?: number) {
  let handle: string | number | NodeJS.Timeout | undefined;
  let arg_: T;
  function eff() {
    cb(arg_);
  }
  return function (arg: T) {
    clearTimeout(handle);
    arg_ = arg;
    handle = setTimeout(eff, delai);
  };
}
