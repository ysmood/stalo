import { useSyncExternalStore } from "react";

/**
 * A function to select a part of the state to return.
 * The selector should be a pure function with no side effects.
 * It should not return a new object every time, or it will cause infinite re-renders.
 */
export type Selector<S, R> = (state: S, serverSide: boolean) => R;

/**
 * A React hook to use the state.
 */
export type UseStore<S> = {
  /**
   * @returns The current state.
   */
  (): S;

  /**
   * @returns The selected part of the state.
   */
  <R>(selector: Selector<S, R>): R;
};

/**
 * A function to produce the next state based on the previous state.
 * The returned value will be the new state.
 */
export type Produce<S> = (previous: S) => S | void;

/**
 * A state or a function to get next state.
 */
export type NextState<S> = S | Produce<S>;

/**
 * A function to update the state. It can be used outside the React components.
 */
export type SetStore<S> = (nextState: NextState<S>, context?: object) => void;

/**
 * Creates a global store for cross-component state management.
 * @param init The initial value of the state.
 */
export default function create<S>(init: S) {
  const [add, run] = pipeline<[]>();

  let state = init;

  const get =
    <P>(selector: Selector<S, P>, serverSide: boolean) =>
    () =>
      selector(state, serverSide);

  const useStore: UseStore<S> = <P>(
    selector: Selector<S, P> = (val: S) => val as unknown as P
  ) => {
    return useSyncExternalStore<S | P>(
      add,
      get(selector, false),
      get(selector, true)
    );
  };

  const setStore: SetStore<S> = (ns: NextState<S>) => {
    state = produce(state, ns);

    // notify all listeners
    run();
  };

  return [useStore, setStore] as const;
}

/**
 * Converts a NextState to a Produce function.
 * @returns
 */
export function produce<S>(state: S, ns: NextState<S>): S {
  const res = ns instanceof Function ? ns(state) : ns;
  return res === undefined ? state : res;
}

/**
 * Creates a pipeline to run multiple stages. The stages will be run in the order they are added.
 * It's a design pattern to inject expensive logic into a function without modifying the function itself.
 * Because the code is not asynchronous events, it's a synchronous pipeline,
 * it will be easy to debug problems like cyclic pipelines.
 * Don't use it for cheap reactions like double a number.
 * @returns A addStage function to add a stage and a run function to run all stages.
 * The addStage function returns a function to remove the stage from the pipeline.
 */
export function pipeline<E extends unknown[]>() {
  type stage = (...args: E) => void;

  const stages = new Set<stage>();

  const addStage = (s: stage) => {
    stages.add(s);
    return () => {
      stages.delete(s);
    };
  };

  const run: stage = (...args) => {
    for (const s of stages) {
      s(...args);
    }
  };

  return [addStage, run] as const;
}
