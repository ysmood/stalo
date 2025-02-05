import { setCurrSession, useCurrSession } from "./session";
import { commitName } from "../constants";
import { setScrollTo, setState } from "./history";
import { getState } from "./store-recordx";
import { addRecord, getRecord } from "./records";
import * as List from "./list";

export function useStaging() {
  return useCurrSession((s) => s.staging);
}

export function usePrevStateContent(): string {
  return useCurrSession((s) => {
    if (s.selected === 0) return "";
    return getState(getRecord(s.records, s.selected - 1)!);
  });
}

export function setStaging(content: string) {
  setCurrSession((s) => {
    if (s.staging === content) return;

    s.staging = content;
  });
}

export function commit() {
  setCurrSession((s) => {
    const state = s.staging;

    if (s.selected !== List.getSize(s.records.list) - 1) {
      s.selected = List.getSize(s.records.list);

      addRecord(s.records, {
        state,
        name: commitName,
        description: "Committed by devtools",
        createdAt: Date.now(),
      });
    }

    s.current = s.selected;

    setScrollTo(s, s.selected);

    setState(s, state);
  });
}

export function useSameLast() {
  return useCurrSession(
    (s) => s.staging === getState(List.getLast(s.records.list))
  );
}

export function format() {
  setCurrSession((s) => {
    s.staging = JSON.stringify(JSON.parse(s.staging), null, 2);
  });
}

export function useDiffMode() {
  return useCurrSession((s) => s.diffMode);
}

export function toggleDiffMode() {
  setCurrSession((s) => {
    s.diffMode = !s.diffMode;
  });
}
