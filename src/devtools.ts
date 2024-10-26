import { produce, SetStore } from ".";
import { isString, uid, type Middleware } from "./utils";

const name = Symbol("action-name");
const description = Symbol("description");

export const DEVTOOLS = "__stalo_devtools__";

export type DevtoolsOptions = {
  [name]?: string;
  [description]?: string;
};

export type StoreRecord<S> = {
  name: string;
  state: S;
  description?: string;
  createdAt: number;
};

export default function devtools<S>(init: S, devName = ""): Middleware<S> {
  return (set) => {
    const subscribers = new Set<Subscriber<S>>();

    addToGlobal(new Devtools(devName, init, set, subscribers));

    return (ns, options?: DevtoolsOptions) => {
      set((prev) => {
        const curr = produce(prev, ns);

        const rec: StoreRecord<S> = {
          state: curr,
          name: options?.[name] || "",
          description: options?.[description],
          createdAt: Date.now(),
        };

        subscribers.forEach((s) => s(rec));

        return curr;
      }, options);
    };
  };
}

function addToGlobal<S>(dt: Devtools<S>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any;

  if (!win[DEVTOOLS]) {
    win[DEVTOOLS] = [];
  }

  win[DEVTOOLS].push(dt);

  window.dispatchEvent(new CustomEvent(DEVTOOLS));
}

export function getDevtools<S>(): Devtools<S>[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any)[DEVTOOLS] || [];
}

type Subscriber<S> = (record: StoreRecord<S>) => void;

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

  subscribe(cb: (record: StoreRecord<S>) => void) {
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

/**
 * A shortcut to create a devtools option.
 * @param action A identifier for the action, better to be unique and easy to filter.
 * It's recommended to use the function as the action.
 * @param actionDescription A description for the action to help you understand what's going on.
 */
export function meta(
  action: string | { name: string },
  actionDescription?: string
): DevtoolsOptions {
  return {
    [name]: isString(action) ? action : action.name,
    [description]: actionDescription,
  };
}
