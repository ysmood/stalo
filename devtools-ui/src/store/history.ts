import { setSession, useSession } from "./session";
import { connections, Session } from "./constants";

export function useRecord(i: number) {
  return useSession((s) => s.history.get(i));
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
    if (i < 0) {
      i = s.history.size + i;
    }

    s.selected = i;
    s.staging = s.history.get(i).state;
  });
}

export function travelTo(i: number) {
  setSession((s) => {
    s.selected = i;
    setScrollTo(s, i);
    const state = s.history.get(i).state;
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
    setScrollTo(s, s.history.size - 1);
  });
}

export function useScrollTo() {
  return useSession((s) => s.scrollTo);
}

export function setScrollTo(s: Session, i: number) {
  s.scrollTo = { val: i };
}
