import { Session } from "./constants";
import { setSession, useSession } from "./session";

export function useRecord(i: number) {
  return useSession((s) => s.history.get(i));
}

export function useRecords() {
  return useSession((s) => s.history.list);
}

// diff between a record with the selected record
export function useTimeDiff(i: number) {
  return useSession((s) => {
    return s.history.get(i).createdAt - s.history.get(s.selected).createdAt;
  });
}

export function useSelected() {
  return useSession((s) => s.selected);
}

export function selectRecord(i: number) {
  setSession((s) => {
    s.selected = i;
    s.staging = format(s.history.get(i).state);
  });
}

export function travelTo(i: number) {
  setSession((s) => {
    s.selected = i;
    setScrollTo(s, i);
    const state = s.history.get(i).state;
    s.staging = format(state);
    s.connection().setState(state);
  });
}

export function setScrollTo(s: Session, i: number) {
  s.scrollTo = i;
}

export function useTotalRecords() {
  return useSession((s) => s.history.filtered.length);
}

function format(state: object) {
  return JSON.stringify(state, null, 2);
}
