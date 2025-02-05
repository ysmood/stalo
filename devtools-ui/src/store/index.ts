import { create } from "stalo/lib/immer";
import { enablePatches, setAutoFreeze } from "immer";
import {
  bufferDelay,
  Connection,
  connections,
  emptySession,
  initStore,
} from "./constants";
import { bufferedCall } from "./utils";
import { addRecord, newRecords } from "./records";
import { getSize } from "./list";

setAutoFreeze(false);
enablePatches();

export const [useStore, setStore] = create(initStore);

export function plug(c: Connection) {
  const id = c.id;

  connections[id] = c;

  c.onInit = (rec) => {
    rec.description = "Initial state when the session was started";

    setStore((store) => {
      if (!store.currSessionId) store.currSessionId = id;

      store.sessions[id] = {
        ...emptySession,
        id,
        name: c.name,
        selected: 0,
        current: 0,
        staging: rec.state,
        records: newRecords(rec),
      };
    });
  };

  c.onRecord = bufferedCall(bufferDelay, (list) => {
    setStore((store) => {
      list.forEach((rec) => {
        addRecord(store.sessions[id].records, rec);
      });
      store.sessions[id].current = getSize(store.sessions[id].records.list) - 1;
    });
  });
}

export function unplug(id: string) {
  setStore((store) => {
    if (store.currSessionId === id) store.currSessionId = "";
    delete store.sessions[id];
  });
}
