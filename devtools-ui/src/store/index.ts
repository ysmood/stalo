import { create } from "stalo/lib/immer";
import { enableMapSet } from "immer";
import { immutable } from "stalo/lib/utils";
import History from "./history.class";
import { bufferDelay, Connection, emptySession, initStore } from "./constants";
import { bufferedCall } from "./utils";

enableMapSet();

export const [useStore, setStore] = create(initStore);

export function plug(c: Connection) {
  const id = c.id;

  c.onInit = (rec) => {
    rec.description = "Initial state when the session was started";

    setStore((store) => {
      if (!store.currSession) store.currSession = id;

      store.sessions[id] = {
        ...emptySession,
        id,
        name: c.name,
        selected: 0,
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
