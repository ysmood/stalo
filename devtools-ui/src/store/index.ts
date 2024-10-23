import { create } from "stalo/lib/immer";
import { enableMapSet } from "immer";
import { immutable, uid } from "stalo/lib/utils";
import History from "./history";
import {
  bufferDelay,
  commitName,
  Connection,
  emptySession,
  initStore,
  recordHeight,
  Session,
} from "./constants";
import { bufferedCall } from "./utils";
import debounce from "debounce";

enableMapSet();

const [useStore, setStore] = create(initStore);

export function plug(c: Connection) {
  const id = c.id;

  c.onInit = (rec) => {
    setStore((store) => {
      if (!store.currSession) store.currSession = id;

      store.sessions[id] = {
        ...emptySession,
        id,
        name: c.name,
        selected: rec.id,
        staging: JSON.stringify(rec.state, null, 2),
        history: new History(rec),
        connection: immutable(c),
      };
    });
  };

  c.onRecord = bufferedCall(bufferDelay, (list) => {
    setStore((store) => {
      list.forEach((rec) => {
        store.sessions[id].history.add(rec);
      });
    });
  });
}

export function unplug(id: string) {
  setStore((store) => {
    if (store.currSession === id) store.currSession = "";
    delete store.sessions[id];
  });
}

const useSession = <T>(selector: (s: Session, ss: boolean) => T) => {
  return useStore((s, ss) => {
    return selector(s.sessions[s.currSession] || emptySession, ss);
  });
};

const setSession = (set: (s: Session) => void) => {
  setStore((s) => {
    const ss = s.sessions[s.currSession];
    if (ss) set(ss);
  });
};

export function useCurrSession() {
  return useStore((s) => s.currSession);
}

export function useSessions() {
  return useStore((s) => s.sessions);
}

export function useRecord(id: string) {
  return useSession((s) => s.history.get(id));
}

export function useRecords() {
  return useSession((s) => s.history);
}

// diff between a record with the selected record
export function useTimeDiff(id: string) {
  return useSession((s) => {
    return s.history.get(id).createdAt - s.history.get(s.selected).createdAt;
  });
}

export function useRecordIDs() {
  return useSession((s) => s.history.ids);
}

export function useStaging() {
  return useSession((s) => s.staging);
}

export function setEditorHandlers(
  get: () => string,
  set: (value: string) => void
) {
  setSession((s) => {
    s.getEditorValue = get;
    s.setEditorValue = set;
  });
}

export function useSelected() {
  return useSession((s) => s.selected);
}

export function selectRecord(id: string) {
  setSession((s) => {
    s.selected = id;
    s.staging = JSON.stringify(s.history.get(id).state, null, 2);
  });
}

export function commit() {
  setSession((s) => {
    const state = JSON.parse(s.getEditorValue());
    const id = uid();
    s.history.add({
      id,
      state,
      name: commitName,
      description: "Committed by devtools",
      createdAt: Date.now(),
    });

    s.connection().setState(state);
  });
}

export function useSetState() {
  return useSession((s) => s.connection().setState);
}

export function useEditorValue() {
  return useSession((s) => s.getEditorValue);
}

export function useGetState() {
  return useSession((s) => s.connection().getState);
}

export async function revert(getState: Connection["getState"]) {
  const state = await getState();

  setSession((s) => {
    s.staging = JSON.stringify(state, null, 2);
  });
}

export function selectSession(id: string) {
  setStore((s) => {
    s.currSession = id;
  });
}

export function useRecordScroll() {
  return useSession((s) => s.recordScroll);
}

export function setRecordScroll(index: number) {
  setSession((s) => {
    if (index === Infinity) {
      s.recordScroll = (s.history.ids.length - 1) * recordHeight;
      return;
    }

    s.recordScroll = index;
  });
}

export function useTotalRecords() {
  return useSession((s) => s.history.ids.length);
}

export function format() {
  setSession((s) => {
    s.setEditorValue(JSON.stringify(JSON.parse(s.getEditorValue()), null, 2));
  });
}

export function useFilter() {
  return useSession((s) => s.filter);
}

export const setFilter = debounce((filter: string) => {
  setSession((s) => {
    s.filter = filter;
  });
}, 300);
