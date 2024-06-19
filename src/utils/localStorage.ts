export function mockLocalStorage(store: Record<string, unknown> = {}) {
  global.localStorage = {
    clear() {
      store = {};
    },
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: any) {
      store[key] = String(value);
    },
    removeItem(key: string) {
      delete store[key];
    },
  } as any;
}
