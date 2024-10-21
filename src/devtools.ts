import { producer, SetStore } from ".";
import { type Middleware } from "./utils";

export const name = Symbol("action-name");
export const description = Symbol("description");

export const devtoolsKey = "__stalo_devtools__";

export type DevtoolsOptions = {
  [name]?: string;
  [description]?: string;
};

export type Record<S> = {
  name: string;
  state: S;
  description?: string;
  createdAt: number;
};

export const noName = "@@no-name";

export const initName = "@@init";

export default function devtools<S>(init: S, devName = ""): Middleware<S> {
  return (set) => {
    const subscribers = new Set<Subscriber<S>>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;

    if (!win[devtoolsKey]) {
      win[devtoolsKey] = [];
    }

    win[devtoolsKey].push(
      new Devtools(
        devName,
        { name: initName, state: init, createdAt: Date.now() },
        set,
        subscribers
      )
    );

    window.dispatchEvent(new CustomEvent(devtoolsKey));

    return (ns, options?: DevtoolsOptions) => {
      const produce = producer(ns);
      set((prev) => {
        const curr = produce(prev);

        subscribers.forEach((s) =>
          s({
            state: curr,
            name: options && options[name] ? options[name] : noName,
            description: options?.[description],
            createdAt: Date.now(),
          })
        );

        return curr;
      }, options);
    };
  };
}

export function getDevtools<S>(): Devtools<S>[] | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any)[devtoolsKey];
}

type Subscriber<S> = (record: Record<S>) => void;

export class Devtools<S> {
  constructor(
    readonly name: string,
    readonly initRecord: Record<S>,
    private set: SetStore<S>,
    private subscribers: Set<Subscriber<S>>
  ) {}

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
    this.set(() => s);
  }
}
