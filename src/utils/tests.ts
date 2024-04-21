export function delai(delai: number) {
  return new Promise((resolve) => setTimeout(resolve, delai));
}
