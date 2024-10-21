import { create } from "stalo/lib/immer";
import { Record } from "stalo/lib/devtools";
import { useEqual } from "stalo/lib/utils";
import deepEqual from "deep-equal";

export interface Connection {
  id: number;
  name: string;
  setState(json: string): void;
  onInit?: (data: Record<unknown>) => void;
  onRecord?: (data: Record<unknown>) => void;
}

const emptySession = {
  name: "",
  selected: 0,
  current: null,
  staging: "",
  history: [],
};

const initStore = {
  selectedSession: 0,
  sessions: [] as {
    name: string;
    selected: number;
    current: unknown;
    staging: string;
    history: Record<unknown>[];
  }[],
};

type Store = typeof initStore;

let stateSetters: Connection["setState"][] = [];

const [useStore, setStore] = create(initStore);

export function plug(c: Connection) {
  stateSetters[c.id] = c.setState;

  c.onInit = (rec) => {
    setStore((store) => {
      store.sessions.push({
        name: c.name,
        selected: 0,
        current: rec.state,
        staging: JSON.stringify(rec.state, null, 2),
        history: [rec],
      });
    });
  };

  c.onRecord = (data) => {
    setStore((store) => {
      const s = store.sessions[c.id];
      s.current = data.state;
      s.history.push(data);
    });
  };
}

export function unplug(id: number) {
  stateSetters = stateSetters.filter((_, i) => i !== id);

  setStore((store) => {
    store.sessions = store.sessions.filter((_, i) => i !== id);
  });
}

export function useSelectedSession() {
  return useStore((s) => s.selectedSession);
}

export function useSessionIDs() {
  return useStore(
    useEqual(
      (s) =>
        s.sessions.map((_, i) => ({
          id: i,
          name: s.sessions[i].name,
        })),
      deepEqual
    )
  );
}

export function useRecord(id: number) {
  return useStore((s) => history(s)[id]);
}

// diff between a record with the selected record
export function useTimeDiff(id: number) {
  return useStore((s) => {
    return history(s)[id].createdAt - history(s)[selected(s)].createdAt;
  });
}

export function useHistoryIDs() {
  return useStore(useEqual((s) => history(s).map((_, i) => i), deepEqual));
}

export function useStaging() {
  return useStore((s) => session(s).staging);
}

export function setStaging(val: string) {
  setStore((s) => {
    session(s).staging = val;
  });
}

export function useSelected() {
  return useStore((s) => selected(s));
}

export function selectRecord(i: number) {
  setStore((s) => {
    session(s).selected = i;
    session(s).staging = JSON.stringify(history(s)[i].state, null, 2);
  });
}

export const commitName = "@@commit";

export function commit(sessionID: number, staging: string) {
  setStore((s) => {
    session(s).current = JSON.parse(staging);
    history(s).push({
      state: session(s).current,
      name: commitName,
      description: "Committed by devtools",
      createdAt: Date.now(),
    });
  });
  stateSetters[sessionID](staging);
}

export function revert() {
  setStore((s) => {
    session(s).staging = JSON.stringify(session(s).current, null, 2);
  });
}

export function selectSession(id: number) {
  setStore((s) => {
    s.selectedSession = id;
  });
}

function history(s: Store) {
  return session(s).history;
}

function selected(s: Store) {
  return session(s).selected;
}

function session(s: Store) {
  return s.sessions[s.selectedSession] || emptySession;
}
