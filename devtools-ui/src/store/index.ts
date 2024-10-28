import { create } from "stalo/lib/immer";
import { enablePatches, setAutoFreeze } from "immer";
import History from "./history.class";
import {
  bufferDelay,
  Connection,
  connections,
  emptySession,
  initStore,
} from "./constants";
import { bufferedCall } from "./utils";

setAutoFreeze(false);
enablePatches();

export const [useStore, setStore] = create(initStore);

export function plug(c: Connection) {
  const id = c.id;

  connections[id] = c;

  c.onInit = (rec) => {
    rec.description = "Initial state when the session was started";

    setStore((store) => {
      if (!store.currSession) store.currSession = id;

      store.sessions[id] = {
        ...emptySession,
        id,
        name: c.name,
        selected: 0,
        staging: rec.state,
        history: new History(rec),
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
