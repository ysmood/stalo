import createState, { produce, NextState, SetStore } from ".";
import { produce as ImmerProduce } from "immer";
import { compose } from "./utils";

/**
 * It's similar to the base create function, but it uses Immer to update the state immutably.
 */
export function create<S>(init: S) {
  const [useStore, setStore] = createState(init);
  return [useStore, compose(setStore, immer)] as const;
}

export default function immer<S>(set: SetStore<S>) {
  return (ns: NextState<S>, opts?: object) =>
    set((s) => ImmerProduce(s, (draft: S) => produce(draft, ns)), opts);
}
