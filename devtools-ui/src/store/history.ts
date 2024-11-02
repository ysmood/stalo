import { setSession, useSession } from "./session";
import { connections, Session } from "./constants";
import { getState } from "./store-recordx";
import { getRecord } from "./records";
import * as List from "./list";

export function useRecord(i: number) {
  return useSession((s) => getRecord(s.records, i));
}

// diff between a record with the selected record
export function useTimeDiff(i: number) {
  return useSession((s) => {
    return (
      getRecord(s.records, i).rec.createdAt -
      getRecord(s.records, s.selected).rec.createdAt
    );
  });
}

export function useSelected() {
  return useSession((s) => s.selected);
}

export function selectRecord(i: number) {
  setSession((s) => {
    if (i < 0) {
      i = List.getSize(s.records.list) + i;
    }

    s.selected = i;
    s.staging = getState(getRecord(s.records, i));
  });
}

export function travelTo(i: number) {
  setSession((s) => {
    s.selected = i;
    setScrollTo(s, i);
    const state = getState(getRecord(s.records, i));
    s.staging = state;
    setState(s, state);
  });
}

export function setState(s: Session, state: string) {
  connections[s.id].setState(state);
}

export function scrollToTop() {
  setSession((s) => {
    setScrollTo(s, 0);
  });
}

export function scrollToBottom() {
  setSession((s) => {
    setScrollTo(s, List.getSize(s.records.list) - 1);
  });
}

export function useScrollTo() {
  return useSession((s) => s.scrollTo);
}

export function setScrollTo(s: Session, i: number) {
  s.scrollTo = { val: i };
}
