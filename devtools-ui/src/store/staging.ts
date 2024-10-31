import { setSession, useSession } from "./session";
import { commitName } from "../constants";
import { setScrollTo, setState } from "./history";

export function useStaging() {
  return useSession((s) => s.staging);
}

export function setStaging(content: string) {
  setSession((s) => {
    if (s.staging === content) return;

    s.staging = content;
  });
}

export function commit() {
  setSession((s) => {
    const state = s.staging;

    s.selected = s.history.size;

    setScrollTo(s, s.selected);

    s.history.add({
      state,
      name: commitName,
      description: "Committed by devtools",
      createdAt: Date.now(),
    });

    setState(s, state);
  });
}

export function useSameLast() {
  return useSession((s) => s.staging === s.history.list.last()?.state);
}

export function format() {
  setSession((s) => {
    s.staging = JSON.stringify(JSON.parse(s.staging), null, 2);
  });
}
