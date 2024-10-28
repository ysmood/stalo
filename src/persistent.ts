import create, { produce } from ".";
import { compose, Middleware } from "./utils";
import immer from "./immer";

export const defaultKey = "global-state";

export default function createPersistentStorage<T>(init: T, key = defaultKey) {
  const storage = new URLStorage(key, init);
  const [useStore, setStore] = create(storage.get());
  const setByStorage = () => setStore(storage.get());
  return [
    useStore,
    compose(setStore, immer, urlStorage(storage)),
    setByStorage,
  ] as const;
}

export function createLocalStorage<T>(init: T, key = defaultKey) {
  const storage = new LocalStorage(key, init);
  const [useStore, setStore] = create(storage.get());
  return [useStore, compose(setStore, immer, localStorage(storage))] as const;
}

export const saveHistory = Symbol("save-history");

export interface URLStorageContext {
  [saveHistory]?: boolean;
}

export function urlStorage<S>(storage: URLStorage<S>): Middleware<S> {
  return function (set) {
    return (ns, ctx?: URLStorageContext) => {
      set((state) => {
        const s = produce(state, ns);
        storage.set(s, ctx?.[saveHistory]);
        return s;
      }, ctx);
    };
  };
}

export function localStorage<S>(storage: LocalStorage<S>): Middleware<S> {
  return function (set) {
    return (ns, ctx) => {
      set((state) => {
        storage.set(state);
        return produce(state, ns);
      }, ctx);
    };
  };
}

export class LocalStorage<S> {
  constructor(private key: string, private init: S) {}

  get() {
    const item = window.localStorage.getItem(this.key);
    return item === null ? this.init : (JSON.parse(item) as S);
  }

  set(val: S) {
    window.localStorage.setItem(this.key, JSON.stringify(val));
  }
}

export class URLStorage<S> {
  constructor(private key: string, private init: S) {}

  get() {
    const hash = location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const item = params.get(this.key);
    return item === null ? this.init : (JSON.parse(item) as S);
  }

  set(val: S, saveHistory?: boolean) {
    const hash = location.hash.substring(1);
    const params = new URLSearchParams(hash);
    params.set(this.key, JSON.stringify(val));

    const u = "#" + params.toString();

    if (saveHistory) {
      history.pushState(null, "", u);
    } else {
      history.replaceState(null, "", u);
    }
  }
}
