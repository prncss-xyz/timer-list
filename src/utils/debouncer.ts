export function getDebouncer<T>(delai: number, cb: (arg: T) => void) {
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
