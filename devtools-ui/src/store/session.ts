import { setStore, useStore } from ".";
import { emptySession, Session } from "./constants";

export const useSession = <T>(selector: (s: Session, ss: boolean) => T) => {
  return useStore((s, ss) => {
    return selector(s.sessions[s.currSession] || emptySession, ss);
  });
};

export const setSession = (set: (s: Session) => void) => {
  setStore((s) => {
    const ss = s.sessions[s.currSession];
    if (ss) set(ss);
  });
};

export function useSessions() {
  return useStore((s) => s.sessions);
}

export function useCurrSession() {
  return useStore((s) => s.currSession);
}

export function selectSession(id: string) {
  setStore((s) => {
    s.currSession = id;
  });
}
