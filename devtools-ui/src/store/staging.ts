import { setSession, useSession } from "./session";
import { commitName } from "../constants";
import { setScrollTo, setState } from "./history";
import { getState } from "./store-recordx";
import { addRecord, getRecord } from "./records";
import * as List from "./list";

export function useStaging() {
  return useSession((s) => s.staging);
}

export function usePrevStateContent(): string {
  return useSession((s) => {
    if (s.selected === 0) return "";
    return getState(getRecord(s.records, s.selected - 1)!);
  });
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

    s.selected = List.getSize(s.records.list);

    setScrollTo(s, s.selected);

    addRecord(s.records, {
      state,
      name: commitName,
      description: "Committed by devtools",
      createdAt: Date.now(),
    });

    setState(s, state);
  });
}

export function useSameLast() {
  return useSession(
    (s) => s.staging === getState(List.getLast(s.records.list))
  );
}

export function format() {
  setSession((s) => {
    s.staging = JSON.stringify(JSON.parse(s.staging), null, 2);
  });
}

export function useDiffMode() {
  return useSession((s) => s.diffMode);
}

export function toggleDiffMode() {
  setSession((s) => {
    s.diffMode = !s.diffMode;
  });
}
