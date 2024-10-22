import { producer, SetStore } from ".";
import { uid, type Middleware } from "./utils";

export const name = Symbol("action-name");
export const description = Symbol("description");

export const devtoolsKey = "__stalo_devtools__";

export type DevtoolsOptions = {
  [name]?: string;
  [description]?: string;
};

export type Record<S> = {
  id: string;
  name: string;
  state: S;
  description?: string;
  createdAt: number;
};

export const noName = "@@no-name";

export default function devtools<S>(init: S, devName = ""): Middleware<S> {
  return (set) => {
    const subscribers = new Set<Subscriber<S>>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;

    if (!win[devtoolsKey]) {
      win[devtoolsKey] = [];
    }

    win[devtoolsKey].push(new Devtools(devName, init, set, subscribers));

    window.dispatchEvent(new CustomEvent(devtoolsKey));

    return (ns, options?: DevtoolsOptions) => {
      const produce = producer(ns);
      set((prev) => {
        const curr = produce(prev);

        const rec = {
          id: uid(),
          state: curr,
          name: options && options[name] ? options[name] : noName,
          description: options?.[description],
          createdAt: Date.now(),
        };

        subscribers.forEach((s) => s(rec));

        return curr;
      }, options);
    };
  };
}

export function getDevtools<S>(): Devtools<S>[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any)[devtoolsKey] || [];
}

type Subscriber<S> = (record: Record<S>) => void;

export class Devtools<S> {
  private current: S;

  constructor(
    readonly name: string,
    init: S,
    private set: SetStore<S>,
    private subscribers: Set<Subscriber<S>>,
    readonly id = uid()
  ) {
    this.current = init;
    this.subscribe(({ state }) => {
      this.current = state;
    });
  }

  subscribe(cb: (record: Record<S>) => void) {
    this.subscribers.add(cb);

    return () => {
      this.subscribers.delete(cb);
    };
  }

  /**
   * Set the current state without creating history.
   */
  set state(s: S) {
    this.current = s;
    this.set(() => s);
  }

  /**
   * Peak the current state without hooking into React.
   */
  get state() {
    return this.current;
  }
}
