import { produce, SetStore } from "stalo";

// Create a custom middleware to log all the state changes.
export default function logger<S>(set: SetStore<S>): SetStore<S> {
  return (ns, ctx) => {
    set((from) => {
      const to = produce(from, ns);

      console.info("Change state", { from, to });

      return to;
    }, ctx);
  };
}
