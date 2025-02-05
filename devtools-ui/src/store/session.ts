import { useRef } from "react";
import { setStore, useStore } from ".";
import { emptySession, Session } from "./constants";

export const useCurrSession = <T>(selector: (s: Session, ss: boolean) => T) => {
  return useStore((s, ss) => {
    return selector(s.sessions[s.currSessionId] || emptySession, ss);
  });
};

export const setCurrSession = (set: (s: Session) => void) => {
  setStore((s) => {
    const ss = s.sessions[s.currSessionId];
    if (ss) set(ss);
  });
};

export function useSessions() {
  const prev = useRef<{ id: string; name: string }[]>([]);

  return useStore((s) => {
    const ids = Object.keys(s.sessions);

    if (
      prev.current.length === ids.length &&
      prev.current.every(({ id }) => s.sessions[id])
    ) {
      return prev.current;
    }

    prev.current = ids.map((id) => {
      return { id, name: s.sessions[id].name };
    });

    return prev.current;
  });
}

export function useCurrSessionId() {
  return useStore((s) => s.currSessionId);
}

export function selectSession(id: string) {
  setStore((s) => {
    s.currSessionId = id;
  });
}
