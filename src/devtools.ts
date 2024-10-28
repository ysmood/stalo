import { enablePatches, Patch, produceWithPatches } from "immer";
import { pipeline, produce, SetStore } from ".";
import { isString, uid, type Middleware } from "./utils";

const name = Symbol("action-name");
const description = Symbol("description");
const patch = Symbol("patch");

export const DEVTOOLS = "__stalo_devtools__";

export interface DevtoolsContext {
  [name]?: string;
  [description]?: string;
  [patch]?: Patch[];
}

export interface StoreRecord<S> {
  name: string;
  description?: string;
  createdAt: number;

  state: S;
  patch?: Patch[];
}

export default function devtools<S>(init: S, devName = ""): Middleware<S> {
  return (set) => {
    const [subscribe, publish] = pipeline<Parameters<Subscriber<S>>>();

    new Devtools(devName, init, set, subscribe);

    return (ns, ctx?: DevtoolsContext) => {
      let curr: S;

      set((prev) => {
        curr = produce(prev, ns);
        return curr;
      }, ctx);

      const rec: StoreRecord<S> = {
        state: curr!,
        patch: ctx?.[patch],
        name: ctx?.[name] || "",
        description: ctx?.[description],
        createdAt: Date.now(),
      };

      publish(rec);
    };
  };
}

type DevtoolsList<S> = Set<Devtools<S>>;

function addToGlobal<S>(dt: Devtools<S>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any;

  let list: DevtoolsList<S> = win[DEVTOOLS];

  if (!list) {
    list = new Set();
    win[DEVTOOLS] = list;
  }

  list.add(dt);

  window.dispatchEvent(new CustomEvent(DEVTOOLS));
}

export function getDevtools<S>(): DevtoolsList<S> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any)[DEVTOOLS] || [];
}

type Subscriber<S> = (record: StoreRecord<S>) => void;

export class Devtools<S> {
  private current: S;
  private closeSubscriber: () => void;

  constructor(
    readonly name: string,
    init: S,
    private set: SetStore<S>,
    readonly subscribe: (s: Subscriber<S>) => () => void,
    readonly id = uid()
  ) {
    this.current = init;

    this.closeSubscriber = this.subscribe(({ state }) => {
      this.current = state;
    });

    addToGlobal(this);
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

  close() {
    this.closeSubscriber();
    getDevtools<S>().delete(this);
  }
}

/**
 * Encode state to wire format.
 */
export function encode<S>(state: S) {
  return JSON.stringify(state, null, 2);
}

/**
 * Creates a devtools context with meta info.
 * @param action A identifier for the action, better to be unique and easy to filter.
 * It's recommended to use the function as the action.
 * @param actionDescription A description for the action to help you understand what's going on.
 */
export function meta(
  action: string | { name: string },
  actionDescription?: string
): DevtoolsContext {
  return {
    [name]: isString(action) ? action : action.name,
    [description]: actionDescription,
  };
}

/**
 * Sets the patch to the context.
 * When it's set, the state record will also carry a diff patch.
 * The middleware before the devtools middleware is responsible for providing the patch.
 * @param ctx The middleware context.
 * @param p The patch to be set.
 */
export function setPatch(ctx: object, p: Patch[]) {
  (ctx as DevtoolsContext)[patch] = p;
}

/**
 * Returns a middleware that uses immer to produce the next state and also provides the patch.
 */
export function immerWithPatch<S>(): Middleware<S> {
  enablePatches();

  return (set) => (ns, ctx) => {
    if (!ctx) {
      ctx = {};
    }

    set((s) => {
      const [newState, patch] = produceWithPatches(s, (draft: S) =>
        produce(draft, ns)
      );

      setPatch(ctx, patch);

      return newState;
    }, ctx);
  };
}
